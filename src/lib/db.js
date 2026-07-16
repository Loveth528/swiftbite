import fs from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'src/data/db.json')

export function getDB() {
  try {
    const fileContents = fs.readFileSync(dbPath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error('Error reading database file, recreating it.', error)
    // Return empty fallback
    return { foods: [], orders: [], users: [] }
  }
}

export function saveDB(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Error writing to database file', error)
    return false
  }
}
