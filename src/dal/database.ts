import { Database } from "sqlite3"
import { runPromise } from "./lib"

export const db = new Database('metabot-db')
const init = async (): Promise<void> => {
  db.parallelize()
  try {
    await runPromise(db, "CREATE TABLE IF NOT EXISTS Quotes (id INTEGER PRIMARY KEY AUTOINCREMENT, quote TEXT)")
    await runPromise(db,
      'CREATE TABLE IF NOT EXISTS Info (\
        id INTEGER PRIMARY KEY CHECK (id = 1),\
        command TEXT DEFAULT NULL,\
        response TEXT DEFAULT NULL)'
    )
    await runPromise(db, 'INSERT INTO Info DEFAULT VALUES')
  } catch (error) {
    if (error.code !== 'SQLITE_CONSTRAINT') console.log(error.message)
  }
}

init()