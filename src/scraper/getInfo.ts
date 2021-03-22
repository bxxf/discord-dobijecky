import userAgents from 'user-agents'
import { editChannel, sendMessage } from 'discordeno'
import { resolutions } from './resolutions.ts'
import { createBrowser } from '../../browser.ts'

export async function getInfo() {
  try {
    let browser = await createBrowser()
    browser.on('disconnected', async () => {
      browser = await createBrowser()
    })

    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(360000)

    const agent = new userAgents()

    await page.setUserAgent(agent.toString())

    await page.setViewport(
      resolutions[Math.floor(Math.random() * resolutions.length)]
    )

    await page.setRequestInterception(true)

    page.on('request', (req) => {
      if (
        req.resourceType() == 'stylesheet' ||
        req.resourceType() == 'font' ||
        req.resourceType() == 'image' ||
        req.url().includes('.js')
      ) {
        req.abort()
      } else {
        req.continue()
      }
    })
    const waitforNav = page.waitForNavigation({
      waitUntil: 'networkidle0',
      timeout: 360000,
    })
    await page
      .goto('https://www.mujkaktus.cz/chces-pridat', {
        waitUntil: 'networkidle0',
        timeout: 360000,
      })
      .catch((e) => {})
    await waitforNav
    await page.waitForSelector(
      'div.wrapper > h2.uppercase + h3.uppercase.text-drawn',
      {
        visible: true,
      }
    )
    const textContent = await page.evaluate(
      () =>
        //@ts-ignore deno-lint-ignore
        document.querySelector(
          'div.wrapper > h2.uppercase + h3.uppercase.text-drawn'
        ).textContent!
    )

    // Close page
    page.close()

    // Work with date
    if (!textContent) return
    const stringDate = textContent.match(
      /(0?[1-9]|[12][0-9]|3[01])\. ?(0?[1-9]|1[0-2])\. ?20[0-9]{2}/
    )

    //Debug date checks
    console.log('Checked: ' + stringDate[0])

    //Get time range
    const timeRegex = /([0-1]?[0-9]|2[0-3]):[0-5][0-9]/g
    const timeRange = []
    let match = timeRegex.exec(textContent)

    while (match != null) {
      timeRange.push(match[0])
      match = timeRegex.exec(textContent)
    }

    const timeRangeString = timeRange[0] + ' - ' + timeRange[1]

    //Debug time checks
    console.log(timeRangeString)
    if (!stringDate) return

    const current = new Date()

    console.log(
      parseInt(timeRange[0]) + ' should be lower or ' + current.getHours()
    )
    console.log(
      parseInt(timeRange[1]) + ' should be higher or ' + current.getHours()
    )
    console.log(parseInt(stringDate[1]) + ' should be ' + current.getDate())
    console.log(
      parseInt(stringDate[2]) + ' should be ' + (current.getMonth() + 1)
    )
    if (
      current.getDate() === parseInt(stringDate[1]) &&
      current.getMonth() + 1 === parseInt(stringDate[2])
    ) {
      console.log('Date OK!')
      if (
        current.getHours() >= parseInt(timeRange[0]) &&
        current.getHours() <= parseInt(timeRange[1])
      ) {
        console.log('Match!')
        editChannel('817457128494727168', { name: stringDate[0] })
        editChannel('817457573573820427', {
          name: timeRangeString,
        })
        editChannel('817457730460844043', {
          name: '✅ ANO JE!',
        })
        return {
          timeRange,
          textContent,
          status: true,
        }
      } else if (current.getHours() < parseInt(timeRange[0])) {
        sendMessage(
          '817197280372588564',
          'Plánuje se dobíječka v ' + timeRange[0] + '!'
        )
      }
    }
    return { status: false }
  } catch (error) {
    console.log(error)
    if (error.message.includes('ERR_CONNECTION_CLOSED')) {
      console.log('Oopps...')
    }
  }
}
