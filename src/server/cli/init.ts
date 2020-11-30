import * as yargs from "yargs";
import { CommandModule } from "yargs";
import DB from '../Services/DB';

const db = new DB();

async function addSampleData(db: DB) {
    const row = await db.get('SELECT COUNT(*) as count from time_entries;');

    if (row.count === 0) {
        const start1 = new Date();
        const start2 = new Date();
        start1.setHours(8, 0);
        start2.setHours(8, 15);

        db.runMany(`
            INSERT INTO time_entries (title, type, start, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
        `, [
            [null, 0, start1, new Date(), new Date()],
            ['Reading E-Mails', 1, start2, new Date(), new Date()],
        ]);
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
            type       INTEGER NOT NULL,
            start      datetime NOT NULL,
            created_at datetime NOT NULL,
            updated_at datetime NOT NULL
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
