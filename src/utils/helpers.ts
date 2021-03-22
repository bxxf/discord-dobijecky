import { botCache } from '../../cache.ts'
import { Command } from '../types/commands.ts'
import { Embed } from './Embed.ts'
import { cache, sendMessage } from 'discordeno'

let paths: string[] = []
let uniqueFilePathCounter = 0
/** This function allows reading all files in a folder. Useful for loading/reloading commands, monitors etc */
export async function importDirectory(path: string) {
  const files = Deno.readDirSync(Deno.realPathSync(path))
  const folder = path.substring(path.indexOf('/src/') + 5)

  if (!folder.includes('/')) console.log(`Loading ${folder}...`)

  for (const file of files) {
    if (!file.name) continue

    const currentPath = `${path}/${file.name}`.replaceAll('\\', '/')
    if (file.isFile) {
      if (!currentPath.endsWith('.ts')) continue
      paths.push(
        `import "${Deno.mainModule.substring(
          0,
          Deno.mainModule.lastIndexOf('/')
        )}/${currentPath.substring(
          currentPath.indexOf('src/')
        )}#${uniqueFilePathCounter}";`
      )
      continue
    }

    await importDirectory(currentPath)
  }

  uniqueFilePathCounter++
}

/** Imports all everything in fileloader.ts */
export async function fileLoader() {
  await Deno.writeTextFile(
    'fileloader.ts',
    paths.join('\n').replaceAll('\\', '/')
  )
  await import(
    `${Deno.mainModule.substring(
      0,
      Deno.mainModule.lastIndexOf('/')
    )}/fileloader.ts#${uniqueFilePathCounter}`
  )
  paths = []
}

export function createCommand(command: Command) {
  botCache.commands.set(command.name, command)
}

export function getTime() {
  const now = new Date()
  const hours = now.getHours()
  const minute = now.getMinutes()

  let hour = hours
  let amOrPm = `AM`
  if (hour > 12) {
    amOrPm = `PM`
    hour = hour - 12
  }

  return `${hour >= 10 ? hour : `0${hour}`}:${
    minute >= 10 ? minute : `0${minute}`
  } ${amOrPm}`
}

export function sendEmbed(channelID: string, embed: Embed, content?: string) {
  return sendMessage(channelID, { content, embed })
}
