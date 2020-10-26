import { ChatUserstate } from "tmi.js"
import { fetchQuotes, addQuote, removeQuote, addCustomCommand, getCustomCommand, updateCustomCommand, deleteCustomCommand } from "./dal"

const rollDie = (die: string): number => {
  if (!die) return 0
  let res = 0
  const [multiple, mod] = die.split('d')
  for (let i = 0; i < +multiple; i++) {
    res += Math.ceil(Math.random() * +mod)
  }
  return res
}

export const handleAbout = (): string => {
  return '\r\n\
    > Just another basic command bot\r\n\
    > Developed by Metarract, for funsies\r\n\
    > Source code on Github: https://github.com/Metarract/Metabot'
}

export const handleHelp = (): string => {
  return `\r\n
    A list of commands can be found here: \r\n https://github.com/Metarract/Metabot/blob/master/COMMANDS.md`
}

const getDiceStrings = (elem: string): string | undefined => {
  const diceMatch = elem.match(/(\d{1,4}d\d{1,4})\b/i)
  if (diceMatch) return diceMatch[0]
}

export const handleDiceRoll = (params: string[]): string => {
  let res = "\r\n"
  const sums: number[] = []
  if (params.length === 0) {
    res += '> Raw: 1d20 || '
    sums.push(rollDie('1d20'))
  } else {
    const stringParts = params.join('').split('+');
    const dice = stringParts.map(getDiceStrings).filter(die => !!die)
    const diceString = dice.join(' + ')
    const numbers = stringParts.map(elem => +elem).filter(elem => !isNaN(elem))
    const numberString = numbers.join(' + ')
    /* eslint-disable-next-line */
    dice.forEach(die => sums.push(rollDie(die!)))
    numbers.forEach(number => sums.push(number))
    res += `> Raw: ${diceString}`
    if (diceString && numberString) res += ' + '
    res += `${numberString} || `
  }
  res += `${sums.join(' + ')}\r\n`
  res += `> > Final: ${sums.reduce((a, b) => a + b)} < <`
  return res
}

export const handleCustomCommand = async (command: string, parameters: string[], userState: ChatUserstate): Promise<void | string> => {
  // may have overcomplicated this because I was excited to use bitwise opers
  // doesn't look awful at a glance but may be a pain from a maintenance perspective
  let customBits = 0;
  let response = ""
  // if (false) customBits += 1
  if (await getCustomCommand(command)) customBits += 1
  if (userState.mod || userState["badges-raw"]?.includes('broadcaster/1')) customBits += 2;
  if (parameters) {
    switch (parameters[0]) {
      case "delete":
        customBits += 4
        break
      case "update":
        customBits += 8
        break
      case "add":
        customBits += 16
        break
      default:
        break
    }
    parameters.splice(0, 1)
    response = parameters.join(" ")
  }
  // test bits descending order to ensure we don't skip more unique options
  if ((customBits & 18) === 18 && !(customBits & 1)) return addCustomCommand(command, response);
  if ((customBits & 11) === 11) return updateCustomCommand(command, response)
  if ((customBits & 7) === 7) return deleteCustomCommand(command)
  if ((customBits & 1) === 1) return getCustomCommand(command)
  return
}

const getRandomQuote = (quotes: string[]): [string, number] => {
  let quote = null
  let index = 0
  while (!quote) {
    index = Math.floor(Math.random() * quotes.length)
    quote = quotes[index]
    if (!quote) quotes.splice(index, 1);
  }
  return [quote, index]
}

export const handleQuote = async (parameters: string[], userState: ChatUserstate): Promise<string | void> => {
  const quotes = await fetchQuotes()
  if (parameters.length) {
    if (!isNaN(+parameters[0])) {
      const quote = quotes[+parameters[0]]
      if (!quote) return
      return `#${+parameters[0]}: ${quote}`
    }
    if (userState.mod || userState["badges-raw"]?.includes('broadcaster/1')) {
      switch (parameters[0]) {
        case `add`:
          if (!parameters[1]) return `You must add a quote`
          return await addQuote(parameters)
        case `remove`:
          if (+parameters[1] >= quotes.length) return `Quote #${parameters[1]} not found`
          return await removeQuote(parameters)
        default:
          return `Improper quote syntax`
      }
    }
  } else {
    const [quote, index] = getRandomQuote(quotes)
    return `#${index}: ${quote}`
  }
}