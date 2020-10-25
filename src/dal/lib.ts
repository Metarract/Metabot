import { Database, RunResult } from "sqlite3"

export const runPromise = async (db: Database, sqlString: string): Promise<RunResult> => {
  return new Promise((resolve, reject) => {
    db.run(sqlString, function (this, err) {
      if (err) reject(err)
      resolve(this)
    })
  })
}