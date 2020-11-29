import { CommandModule } from "yargs";
import * as yargs from "yargs";
import * as path from "path";
import app from "../../config/app";
import { Database } from "sqlite3";

const sqlite3 = require('sqlite3').verbose();
const DB_PATH = path.join(`${process.cwd()}${app.dbPath}`);

function addSampleData(DB: Database) {
    return new Promise((resolve, reject) => {
        DB.get('SELECT COUNT(*) as count from time_entries;', [], (err: Error | null, row) => {
            if (err) {
                reject(err);
                return;
            }

            if (row.count === 0) {
                const insert = `INSERT INTO time_entries (title, created_at, updated_at)
                                VALUES (?, ?, ?)`;
                DB.run(insert, ['Reading E-Mails', new Date(), new Date()]);
            }

            resolve(row.count);
        });
    })
}

function handler(args: yargs.Arguments<{}>): void {
    const DB = new sqlite3.Database(DB_PATH, (err: Error | null) => {
        if (err) {
            return console.error(err.message);
        }
    });

    if (args.reset === true) {
        DB.exec('DROP TABLE IF EXISTS time_entries;');
    }

    DB.exec(`
        CREATE TABLE IF NOT EXISTS time_entries
        (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            title      text,
            created_at datetime,
            updated_at datetime
        );
    `, (err: Error | null) => {
        if (err) console.error(err.message);
    });

    addSampleData(DB).then(() => DB.close());
}

const InitModule: CommandModule = {
    command: 'init',
    describe: 'Setup the database.',
    builder: {
        reset: { type: 'boolean', default: false },
    },
    aliases: [],
    deprecated: false,
    handler,
};

export default InitModule;
