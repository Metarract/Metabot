import { ChatUserstate } from "tmi.js"
import { fetchQuotes, addQuote, removeQuote, getInfo, updateModpack } from "./dal"

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
    A list of commands can be found here: \r\n I HAVEN'T PUSHED THIS YET SO GOOD LUCK LOLOLOL`
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

export const handleModPack = async (params: string[], userState: ChatUserstate): Promise<string> => {
  if (params.length && (userState.mod || userState["badges-raw"]?.includes('broadcaster/1'))) {
    if (params[0] === 'set') {
      const modPackString = params.filter((param, index) => index !== 0).join(' ')
      return updateModpack(modPackString);
    }
  }
  return (await getInfo()).modpack
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