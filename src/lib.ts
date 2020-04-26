import { Message, Client } from "discord.js";
import { handleDiceRoll, handleHelp, handleAbout } from "./commands";

const commandHandler = async (commandString: string, client: Client): Promise<void | string> => {
  const [command, ...parameters] = commandString.slice(1).split(` `).filter(param => !!param)
  switch (command.toLowerCase()) {
    case "about":
      return handleAbout()
    case "help":
      return handleHelp()
    case "roll":
      return handleDiceRoll(parameters)
    default:
      return
  }
  return
}

export const replyHandler = async (client: Client, message: Message): Promise<string | void> => {
  const msgContent = message.content.trim()
  if (msgContent.startsWith(`!`)) {
    const response = await commandHandler(msgContent, client)
    return response
  }
  return
}