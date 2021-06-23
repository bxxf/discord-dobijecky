import { fetchMessage } from "./api/fetch";
import { Webhook, MessageBuilder } from "discord-webhook-node"
import { redisClient } from './api/utils/redis';
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { fetchApi } from './api/fetchApi';

const app = express();
const server = http.createServer(app);
const io = new Server(server)

app.get('/status', async (req, res) => {
    const result = await fetchApi()
    res.send(result)
})

server.listen(process.env.PORT || 3000, () => {
    console.log(`App running on port ${process.env.PORT || 3000}`);
});

io.on("add", async (hookUrl: string) => {
    await redisClient.sadd("webhooks", hookUrl);
    return true;
});

//TODO: extract
setInterval(() => {

    fetchMessage().then(async (response) => {
        console.log(response)
        const dateString = response.match(
            /(0?[1-9]|[12][0-9]|3[01])\. ?(0?[1-9]|1[0-2])\. ?20[0-9]{2}/
        );

        const currentDate = new Date();

        if (currentDate.getMonth() !== parseInt(dateString[2]) || currentDate.getDay() !== parseInt(dateString[1])) return

        const timeRange: any = [];
        const timeRegex = /([0-1]?[0-9]|2[0-3]):[0-5][0-9]/g;

        let match = timeRegex.exec(response);

        while (match != null) {
            timeRange.push(match[0]);
            match = timeRegex.exec(response);
        }

        if (
            currentDate.getHours() >= parseInt(timeRange[0]) &&
            currentDate.getHours() <= parseInt(timeRange[1])
        ) {

            redisClient.get("sentDay", (err, reply) => {
                const sent = reply === dateString[1];
                if (sent === true) return console.log("Already sent");
                io.emit("dobijecka", {
                    from: timeRange[0],
                    to: timeRange[1],
                    day: dateString[1],
                    month: dateString[2]
                })
                const embed = new MessageBuilder();

                embed.setTitle(`Dobíječka právě probíhá! ${timeRange[0]} - ${timeRange[1]}`);
                embed.setAuthor('Kaktus Dobíječky', 'https://cdn.discordapp.com/icons/817194959622242374/828aaca7136f05f9c75ddc9846742c82.webp?size=256', 'https://www.mujkaktus.cz/dobiti-kreditu');
                embed.setColor(0xb2fccb);
                embed.setDescription(response);
                embed.setTimestamp();

                redisClient.sscan("webhooks", ['0'], (err, reply) => {
                    reply[1].forEach((hookUrl: string) => {

                        const hook = new Webhook(hookUrl);

                        hook.setUsername("Kaktus Dobíječky");
                        hook.setAvatar('https://cdn.discordapp.com/icons/817194959622242374/828aaca7136f05f9c75ddc9846742c82.webp?size=256');
                        hook.send("@here");
                        hook.send(embed);
                    })
                    redisClient.set("sentDay", dateString[1]);
                })

            })

        }
        else if (currentDate.getHours() < parseInt(timeRange[0])) {

            redisClient.get("sentPlannedDay", (err, reply) => {
                const sent = reply === dateString[1];
                if (sent === true) return console.log("Already sent - planned")
                redisClient.sscan("webhooks", ['0'], (err, reply) => {
                    reply[1].forEach((hookUrl: string) => {


                        const hook = new Webhook(hookUrl);

                        hook.setUsername("Kaktus Dobíječky");
                        hook.setAvatar('https://cdn.discordapp.com/icons/817194959622242374/828aaca7136f05f9c75ddc9846742c82.webp?size=256');

                        hook.send(`Plánovaná dobíječka v ${timeRange[0]} - ${timeRange[1]}`)
                    })
                })
                redisClient.set("sentPlannedDay", dateString[1])
            })

        }



    }).catch(error => console.log(error))
}, 300000)


