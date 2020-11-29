import * as path from "path";
import { Database } from "sqlite3";
import app from "../../config/app";

export default class DB {
    private db: Database;

    constructor() {
        const sqlite3 = require('sqlite3').verbose();
        const DB_PATH = path.join(`${process.cwd()}${app.dbPath}`);

        this.db = new sqlite3.Database(DB_PATH, (err: Error | null) => {
            if (err) {
                return console.error(err.message);
            }
        });
    }

    exec(query: string, errorCallback: (err: Error) => any = () => {
    }): void {
        this.db.exec(query, (err) => {
            if (err) {
                errorCallback(err);
                return console.error(err.message);
            }
        });
    }

    async get(query: string, params: Array<any> = []): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err: Error | null, row: any) => {
                if (err) {
                    reject(err);
                    return console.error(err.message);
                }

                resolve(row);
            });
        });
    }

    run(query: string, params: Array<any> = []): void {
        this.db.run(query, params, (err: Error | null) => {
            if (err) {
                console.error(err.message);
            }
        });
    }

    close(): void {
        this.db.close();
    }
};
