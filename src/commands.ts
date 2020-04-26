import { Client } from "discord.js";

interface CommandDetails {
  [key: string]: {
    [key: string]: string;
  }
}


enum BotCommands {
  ABOUT = "about",
  HELP = "help",
  ROLL = "roll",
}

const commandDetails: CommandDetails = {
  about: {
    '': '# About this bot'
  },
  help: {
    '': '# Generate a list of commands and their uses'
  },
  roll: {
    '': '# Roll a d20',
    '1d2 + 3': '# Roll a number of dice and add a flat number on top of that. This string can be any combination of these integers, separated by a \'+\''
  }
}

const getCommandDetails = (commandKey: string, detailKeys: string[]): string => {
  let res = ''
  const defaultPadding = 13 - commandKey.length + 2
  detailKeys.forEach(detailKey => {
    res += `!${commandKey.toLowerCase()}`
    if (detailKey !== '') {
      res += ` ${detailKey}:${''.padEnd(defaultPadding - detailKey.length)}`
    } else {
      res += `: ${''.padEnd(defaultPadding)}`
    }
    res += ` ${commandDetails[commandKey][detailKey]}\r\n`
  })
  res += '---\r\n'
  return res
}

const rollDie = (die: string): number => {
  if (!die) return 0
  let res = 0
  const [multiple, mod] = die.split('d')
  for (let i = 0; i < +multiple; i++) {
    res += Math.ceil(Math.random()*+mod)
  }
  return res
}

export const handleAbout = (): string => {
  return '\r\n\
  # Just another basic command bot\r\n\
  # Developed by Metarract, for funsies\r\n\
  # Source code on Github: https://github.com/Metarract/Metabot'
}

export const handleHelp = (): string => {
  let res = 'Metabot has the following commands:\r\n```yaml\r\n'
  const commands = Object.values(BotCommands)
  commands.forEach(command => {
    const key = Object.keys(commandDetails).find(key => key.toLowerCase() === command.toLowerCase())
    if (!key) throw Error(`Command ${command} is missing a description`)
    const detailKeys = Object.keys(commandDetails[key])
    res += getCommandDetails(key, detailKeys)
  })
  res += `\`\`\``
  return res
}

export const handleDiceRoll = (params: string[]) => {
  let res = "Rolling:\r\n\`\`\`diff\r\n"
  const sums: number[] = []
  if (params.length === 0) {
    res += '- Raw: 1d20\r\n'
    sums.push(rollDie('1d20'))
  } else {
    const stringParts = params.join('').split('+');
    console.log(stringParts)
    const dice = stringParts.map(elem => {
      const diceMatch = elem.match(/(\dd\d+)\b/i)
      if (diceMatch) return diceMatch[0]
    }).filter(die => !!die)
    const diceString = dice.join(' + ')
    const numbers = stringParts.map(elem => +elem).filter(elem => !isNaN(elem))
    const numberString = numbers.join(' + ')
    dice.forEach(die => sums.push(rollDie(die!)))
    numbers.forEach(number => sums.push(number))
    res += `- Raw: ${diceString}`
    if (diceString && numberString) res += ' + '
    res += `${numberString}\r\n`
  }
  res += `- Results: ${sums.join(' + ')}\r\n`
  res += `+ Final: ${sums.reduce((a, b) => a + b)}\r\n`
  res += `\`\`\``
  return res
}