import axios from "axios"
import { createBrowser } from './utils/browser';
import useProxy from "puppeteer-page-proxy";
import userAgents from 'user-agents'
import { Browser } from "puppeteer";

import dotenv from "dotenv"

dotenv.config()

let browser: Browser;
const newBrowser = async () => {
    browser = await createBrowser()
    browser.on('disconnected', async () => {
        browser = await createBrowser()
    })
}

export const fetchMessage = (async (proxied = false) => {

    const URL = process.env.URL
    if (proxied) {

        const options = {
            token: process.env.PROXY_TOKEN,
            url: URL,
            css_selectors: ["div.wrapper > h2.uppercase + h3.uppercase.text-drawn"],
            javascript_enabled: true
        };

        const response = await axios.post(process.env.PROXY_API, options)
        return response.data.css_selectors![0]![0]!
    }
    else {

        if (!browser) await newBrowser()
        const page = await browser.newPage()


        const agent = new userAgents()
        await page.setUserAgent(agent.toString())

        await page
            .goto(URL, {
                waitUntil: 'networkidle0',
                timeout: 30000,
            });

        await page.waitForSelector("div.wrapper > h2.uppercase + h3.uppercase.text-drawn", { timeout: 30000 });


        const message = await page.evaluate(
            () => document.querySelector("div.wrapper > h2.uppercase + h3.uppercase.text-drawn").textContent!
        )

        return message

    }
}
)