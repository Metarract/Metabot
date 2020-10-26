import { Message, Client } from "discord.js";
import { ChatUserstate } from "tmi.js";
import { handleDiceRoll, handleHelp, handleAbout, handleQuote, handleCustomCommand } from "./commands";

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
}

const twitchCommandHandler = async (commandString: string, userState: ChatUserstate): Promise<void | string> => {
  const [commandBase, parameters] = splitMessage(commandString)
  const command = commandBase.toLowerCase()
  switch (command) {
    case "about":
      return handleAbout()
    case "commands":
    case "help":
      return handleHelp()
    case "roll":
      return handleDiceRoll(parameters)
    case "quote":
      return await handleQuote(parameters, userState);
    default:
      return handleCustomCommand(command, parameters, userState)
  }
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