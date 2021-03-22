import { botCache } from '../../cache.ts'
import { updateEventHandlers } from 'discordeno'
import { createCommand, fileLoader, importDirectory } from '../utils/helpers.ts'
import { PermissionLevels } from '../types/commands.ts'
import { clearTasks, registerTasks } from '../utils/taskHelper.ts'

const folderPaths = new Map([
  ['commands', './src/commands'],
  ['events', './src/events'],
  ['inhibitors', './src/inhibitors'],
  ['arguments', './src/arguments'],
  ['monitors', './src/monitors'],
  ['tasks', './src/tasks'],
  ['perms', './src/permissionLevels'],
])

createCommand({
  name: `reload`,
  permissionLevels: [PermissionLevels.BOT_DEVS],
  botChannelPermissions: ['SEND_MESSAGES'],
  execute: async function (message) {
    clearTasks()
    await Promise.all(
      [...folderPaths.values()].map((path) =>
        importDirectory(Deno.realPathSync(path))
      )
    )
    await fileLoader()
    registerTasks()
    updateEventHandlers(botCache.eventHandlers)

    return message.reply('Reloaded everything.')
  },
})
