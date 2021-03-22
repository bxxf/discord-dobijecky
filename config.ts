export const config = {
  prefix: '!',
  userIDs: {
    botDevs: [Deno.env.get('DEV_ID') as string] as string[],
  },
}
