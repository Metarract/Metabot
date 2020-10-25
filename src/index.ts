import { Client as DiscordClient } from "discord.js"
import { discordReplyHandler, twitchReplyHandler } from "./lib"
import { Client as TwitchClient, Options as TwitchOptions } from "tmi.js"

const main = async (): Promise<void> => {
  if (!process.env.PRODUCTION) {
    const dotenv = await import("dotenv")
    dotenv.config()
  }

  //#region Discord Setup
  const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN
  if (!DISCORD_TOKEN) throw Error('Missing Discord bot token')

  const discordClient = new DiscordClient({
    retryLimit: 15
  })

  discordClient.on("message", async message => {
    try {
      if (message.author.id === discordClient.user?.id) return
      const response = await discordReplyHandler(discordClient, message)
      if (response) message.reply(response)
    } catch (error) {
      console.log(error)
      message.reply('Metabot encountered an error')
    }
  })
  discordClient.on('ready', () => console.log(`${discordClient.user?.tag} is online`))
  discordClient.login(DISCORD_TOKEN)
  //#endregion

  //#region Twitch Setup
  const TWITCH_SECRET = process.env.TWITCH_BOT_SECRET
  if (!TWITCH_SECRET) throw Error('Missing Twitch bot token')

  const TWITCH_USERNAME = process.env.TWITCH_BOT_USERNAME
  if (!TWITCH_USERNAME) throw Error('Missing Twitch bot username')

  const TWITCH_TOKEN = process.env.TWITCH_BOT_TOKEN
  if (!TWITCH_TOKEN) throw Error('Missing Twitch bot oauth token')

  const TWITCH_CHANNELS = process.env.TWITCH_BOT_CHANNELS?.split(',')
  if (!TWITCH_CHANNELS) throw Error('Missing Twitch bot channels')

  const twitchOptions = {
    identity: {
      username: TWITCH_USERNAME,
      password: TWITCH_TOKEN
    },
    channels: TWITCH_CHANNELS
  } as TwitchOptions

  const twitchClient = TwitchClient(twitchOptions)

  twitchClient.on('message', async (channel, userState, message, self) => {
    try {
      if (self) return
      const response = await twitchReplyHandler(message, userState)
      if (response) twitchClient.say(channel, response);
    } catch (error) {
      console.log(error)
      twitchClient.say(channel, 'Metabot encountered an error');
    }
  })
  twitchClient.on('connected', async (address, port) => {
    console.log(`Twitch connected to ${TWITCH_CHANNELS.toString()} channels with address: ${address} and on port: ${port}`)
  })
  twitchClient.connect();
  //#endregion

}

main()
