import { Message, Client } from "discord.js";
import { ChatUserstate } from "tmi.js";
import { handleDiceRoll, handleHelp, handleAbout, handleModPack, handleQuote } from "./commands";

const splitMessage = (message: string): [string, string[]] => {
  const [command, ...parameters] = message.slice(1).split(` `).filter(param => param !== null || param !== undefined);
  return [command, parameters]
}

const discordCommandHandler = async (commandString: string): Promise<void | string> => {
  const [command, parameters] = splitMessage(commandString)
  switch (command.toLowerCase()) {
    case "about":
      return handleAbout()
    case "commands":
    case "help":
      return handleHelp()
    case "roll":
      return handleDiceRoll(parameters)
    default:
      return
  }
  return
}

const twitchCommandHandler = async (commandString: string, userState: ChatUserstate): Promise<void | string> => {
  const [command, parameters] = splitMessage(commandString)
  switch (command.toLowerCase()) {
    case "about":
      return handleAbout()
    case "commands":
    case "help":
      return handleHelp()
    case "roll":
      return handleDiceRoll(parameters)
    case "modpack":
    case "modpacks":
    case "mods":
    case "mod":
      return await handleModPack(parameters, userState);
    case "quote":
      return await handleQuote(parameters, userState);
    case "pp":
      return "it small u_u"
    default:
      return
  }
  return
}

export const discordReplyHandler = async (client: Client, message: Message): Promise<string | void> => {
  const msgContent = message.content.trim()
  if (msgContent.startsWith(`!`)) {
    const response = await discordCommandHandler(msgContent)
    return response
  }
  return
}

export const twitchReplyHandler = async (message: string, userState: ChatUserstate): Promise<string | void> => {
  const msgContent = message.trim()
  if (msgContent.startsWith(`!`)) {
    const response = await twitchCommandHandler(msgContent, userState)
    return response
  }
  return
}