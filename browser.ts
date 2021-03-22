import puppeteer from 'puppeteer'
import axiod from 'https://deno.land/x/axiod/mod.ts'
const path = Deno.env.get('CHROMIUM_PATH')
  ? { executablePath: Deno.env.get('CHROMIUM_PATH') }
  : null
const proxy = await axiod.get(Deno.env.get('PROXY_API')!)
export const createBrowser = async () => {
  try {
    return await puppeteer.launch({
      ...path,
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
        '--proxy-server=' + proxy.data.url,
      ],
      ignoreHTTPSErrors: true,
    })
  } catch {
    return await puppeteer.launch({
      ...path,
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
    })
  }
}
