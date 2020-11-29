import * as yargs from "yargs";
import { CommandModule } from "yargs";
import DB from '../Services/DB';

const db = new DB();

async function addSampleData(db: DB) {
    const row = await db.get('SELECT COUNT(*) as count from time_entries;');

    if (row.count === 0) {
        db.run(`
            INSERT INTO time_entries (title, created_at, updated_at)
            VALUES (?, ?, ?)
        `, ['Reading E-Mails', new Date(), new Date()]);
    }
}

function handler(args: yargs.Arguments<{}>): void {
    if (args.reset === true) {
        db.exec('DROP TABLE IF EXISTS time_entries;');
    }

    db.exec(`
        CREATE TABLE IF NOT EXISTS time_entries
        (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            title      text,
            created_at datetime,
            updated_at datetime
        );
    `);

    addSampleData(db)
        .then(() => {
            db.close();
        });
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
