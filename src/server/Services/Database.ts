import app from "../../config/app";
import * as path from "path";
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(`${__dirname}${app.dbPath}`);

const db = new sqlite3.Database(DB_PATH, (err: Error | null) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database');
    }
});

export default db;
