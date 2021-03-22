import { createCommand } from '../utils/helpers.ts'
import { PermissionLevels } from '../types/commands.ts'

createCommand({
  name: `ann`,
  arguments: [
    {
      name: 'message',
      type: '...string',
      defaultValue: '',
    },
  ],
  botChannelPermissions: ['SEND_MESSAGES'],
  permissionLevels: [PermissionLevels.BOT_DEVS],
  execute: function (message, args: AnnounceArgs) {
    message.delete()
    message.send(args.message)
  },
})

interface AnnounceArgs {
  message: string
}
