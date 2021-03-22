import { Intents, startBot } from 'discordeno'
import { fileLoader, importDirectory } from './src/utils/helpers.ts'
import { botCache } from './cache.ts'

import { config } from 'https://deno.land/x/dotenv/mod.ts'

config({ export: true })

console.info(
  'Beginning Bot Startup Process. This can take a little bit depending on your system. Loading now...'
)

// Forces deno to read all the files which will fill the commands/inhibitors cache etc.
await Promise.all(
  [
    './src/arguments',
    './src/commands',
    './src/inhibitors',
    './src/events',
    './src/monitors',
    './src/tasks',
    './src/permissionLevels',
  ].map((path) => importDirectory(Deno.realPathSync(path)))
)
await fileLoader()

startBot({
  token: Deno.env.get('BOT_TOKEN') as string,
  // Pick the intents you wish to have for your bot.
  // For instance, to work with guild message reactions, you will have to pass the Intents.GUILD_MESSAGE_REACTIONS intent to the array.
  intents: [Intents.GUILDS, Intents.GUILD_MESSAGES],
  // These are all your event handler functions. Imported from the events folder
  eventHandlers: botCache.eventHandlers,
})
