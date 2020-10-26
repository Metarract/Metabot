import { db } from "./database"
import { RunResult } from "sqlite3"

interface Quote {
  quote: string;
}

interface CustomCommand {
  [key: string]: string; 
}

export const getCustomCommand = async (command: string): Promise<any | void> => {
  try {
    const returnedRow: Promise<CustomCommand> = new Promise((resolve, reject) => {
      db.get(`SELECT response FROM CustomCommands WHERE command = '${command}'`, function (err, row) {
        if (err) {
          reject(err)
        }
        resolve(row)
      })
    })
    const row = await returnedRow
    if (row) {
      return row.response
    }
  } catch (error) {
    return "Something went wrong, please try again"
  }
}

export const deleteCustomCommand = async (command: string): Promise<string | void> => {
  try {
    const returnedRows: Promise<RunResult> = new Promise((resolve, reject) => {
      db.run(`DELETE FROM CustomCommands WHERE command = '${command}'`, function (this, err) {
        if (err) reject(err)
        resolve(this)
      })
    })
    await returnedRows
    return 'Command removed'
  } catch (error) {
    console.log(error)
    return 'Something went wrong, please try again'
  }
}

export const addCustomCommand = async (command: string, response: string): Promise<string> => {
  try {
    const returnedRows: Promise<RunResult> = new Promise((resolve, reject) => {
      db.run(`INSERT INTO CustomCommands(command, response) VALUES('${command}','${response}')`, function (this, err) {
        if (err) reject(err)
        resolve(this)
      })
    })
    await returnedRows
    return `Command ${command} added`
  } catch (error) {
    return "Something went wrong, please try again"
  }
}

export const updateCustomCommand = async (command: string, response: string): Promise<string | void> => {
  try {
    const returnedRows: Promise<RunResult> = new Promise((resolve, reject) => {
      db.run(`UPDATE CustomCommands SET response = '${response}' WHERE command = '${command}'`, function (this, err) {
        if (err) reject(err)
        resolve(this)
      })
    })
    await returnedRows
    return 'Command updated'
  } catch (error) {
    console.log(error)
    return
  }
}

export const fetchQuotes = async (): Promise<string[]> => {
  try {
    const returnedRows: Promise<Quote[]> = new Promise((resolve, reject) => {
      db.all("SELECT * FROM Quotes", (err, rows) => {
        if (err) reject(err)
        resolve(rows)
      })
    })
    return (await returnedRows).map(row => row.quote)
  } catch (error) {
    throw Error(error)
  }
}

export const addQuote = async (parameters: string[]): Promise<string> => {
  try {
    const quote = (parameters.splice(1).join(` `))
    const returnedRows: Promise<RunResult> = new Promise((resolve, reject) => {
      db.run(`INSERT INTO Quotes(quote) VALUES('${quote}')`, function (this, err) {
        if (err) reject(err)
        resolve(this)
      })
    })
    await returnedRows
    return `Quote added`
  } catch (error) {
    return `We encountered an error, please try again`
  }
}

export const removeQuote = async (parameters: string[]): Promise<string | void> => {
  try {
    const index: number = +parameters[1]
    const returnedRows: Promise<RunResult> = new Promise((resolve, reject) => {
      db.run(`UPDATE Quotes SET quote = NULL WHERE quoteId = ${index + 1}`, function (this, err) {
        if (err) reject(err)
        resolve(this)
      })
    })
    await returnedRows
    return `Quote #${index} has been culled`
  } catch (error) {
    console.log(error)
    return
  }
}
