import { Client } from "discord.js"
import { replyHandler } from "./lib"

const main = async (): Promise<void> => {
  if (!process.env.PRODUCTION) {
    const dotenv = await import("dotenv")
    dotenv.config()
  }
  const TOKEN = process.env.BOT_TOKEN
  if (!TOKEN) throw Error('Missing bot token')

  const client = new Client({
    retryLimit: 15
  })
  client.on("message", async message => {
    if (message.author.id === client.user?.id) return
    const response = await replyHandler(client, message)
    if (response) message.reply(response)
  })
  client.on('ready', () => console.log(`${client.user?.tag} is online`))
  client.login(TOKEN)
}

main()
