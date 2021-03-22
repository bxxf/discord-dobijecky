import {
  ActivityType,
  cache,
  editBotsStatus,
  StatusTypes,
  sendMessage,
  guildIconURL,
  getGuild,
  editChannel,
} from 'discordeno'
import { botCache } from '../../cache.ts'
import { registerTasks } from './../utils/taskHelper.ts'
import { sendEmbed } from '../utils/helpers.ts'
import { Embed } from '../utils/Embed.ts'
import { getInfo } from '../scraper/getInfo.ts'

botCache.eventHandlers.ready = async function () {
  editBotsStatus(
    StatusTypes.DoNotDisturb,
    'Kontrolování Dobíječek',
    ActivityType.Game
  )
  console.log(`Loaded ${botCache.arguments.size} Argument(s)`)
  console.log(`Loaded ${botCache.commands.size} Command(s)`)
  console.log(`Loaded ${Object.keys(botCache.eventHandlers).length} Event(s)`)
  console.log(`Loaded ${botCache.inhibitors.size} Inhibitor(s)`)
  console.log(`Loaded ${botCache.monitors.size} Monitor(s)`)
  console.log(`Loaded ${botCache.tasks.size} Task(s)`)

  const guild = await getGuild('817194959622242374')
  const icon = guildIconURL(guild as any)

  registerTasks()

  let sent = false
  setInterval(async () => {
    const res = await getInfo().catch((e) => console.log(e))
    if (!res || !res.status) {
      sent = false
      editChannel('817457730460844043', {
        name: '🚫  NE NENÍ',
      })
      return
    }
    if (!sent) {
      const embed = new Embed()
        .setTitle(
          'Dobíječka právě probíhá! ' +
            res.timeRange![0] +
            ' - ' +
            res.timeRange![1]
        )
        .setColor('0xb2fccb')
        .setAuthor('Kaktus Dobíječky', icon)
        .setDescription(res.textContent)
        .setTimestamp()
      sendMessage('817197280372588564', '@everyone')
      sendEmbed('817197280372588564', embed)
      sent = true
    }
  }, 600000)

  console.log(
    `[READY] Bot is online and ready in ${cache.guilds.size} guild(s)!`
  )
}
