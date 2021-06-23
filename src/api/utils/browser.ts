const puppeteer = require("puppeteer-extra");
import StealthPlugin from "puppeteer-extra-plugin-stealth"

puppeteer.use(StealthPlugin())

export const createBrowser = () => puppeteer.launch({
    headless: true,
    args: [
        '--headless',
        '--disable-gpu',
        '--window-size=1920x1080',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
    ],
    ignoreHTTPSErrors: true,
} as any)
