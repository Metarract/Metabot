import { db } from "./database"
import { RunResult } from "sqlite3"

interface Quote {
  quote: string;
}

interface Info {
  modpack: string;
}

export const getInfo = async (): Promise<Info> => {
  try {
    const returnedRows: Promise<Info[]> = new Promise((resolve, reject) => {
      db.all("SELECT * FROM Info", (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      })
    })
    console.log(await returnedRows)
    const infoObject: Info[] = (await returnedRows).map(row => {
      return {
        modpack: row.modpack
      } as Info
    })
    return infoObject[0];
  } catch (error) {
    throw Error(error)
  }
}

export const updateModpack = async (modpackInfo: string): Promise<string> => {
  try {
    const returnedRows = new Promise<RunResult>((resolve, reject) => {
      db.run(`UPDATE Info SET modpack = "${modpackInfo}" WHERE id = 1`, function (this, err) {
        if (err) reject(err)
        resolve(this)
      })
    })
    await returnedRows
    return 'Info Updated'
  } catch (error) {
    console.log(error)
    return 'Something went wrong, please try again'
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
