import * as yargs from "yargs";
import { CommandModule } from "yargs";
import DB from '../Services/DB';

const db = new DB();

type InitCommandArguments = { reset: boolean };

function handler(args: yargs.Arguments<InitCommandArguments>): void {
    if (args.reset === true) {
        db.exec('DROP TABLE IF EXISTS time_entries;');
    }

    db.exec(`
        CREATE TABLE IF NOT EXISTS time_entries
        (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            title      TEXT,
            type       INTEGER  NOT NULL,
            time       DATETIME NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL
        );
    `);

    addSampleData(db)
        .then(() => {
            db.close();
        });
}

async function addSampleData(db: DB) {
    const row = await db.get('SELECT COUNT(*) as count from time_entries;');

    if (row.count === 0) {
        const start1 = new Date();
        const start2 = new Date();
        start1.setHours(8, 0);
        start2.setHours(8, 15);

        db.runMany(`
            INSERT INTO time_entries (title, type, time, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
        `, [
            [null, 0, start1, new Date(), new Date()],
            ['Reading E-Mails', 1, start2, new Date(), new Date()],
        ]);
    }
}

const InitModule: CommandModule<{}, InitCommandArguments> = {
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
