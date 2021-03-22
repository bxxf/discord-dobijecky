import { botCache } from '../../cache.ts'
import { PermissionLevels } from '../types/commands.ts'
import { config } from '../../config.ts'

// The member using the command must be one of the bots dev team
botCache.permissionLevels.set(
  PermissionLevels.BOT_DEVS,
  // deno-lint-ignore require-await
  async (message) => config.userIDs.botDevs.includes(message.author.id)
)
