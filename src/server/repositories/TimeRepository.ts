import DB from "../services/DB";
import { TimeEntry } from "../models/TimeEntry";
import { parseDto, parseDtoArray } from "../services/DomainConverter";
import { TimeEntryType } from "../enums/TimeEntryType";

export default class TimeRepository {
    private db: DB;

    constructor() {
        this.db = new DB();
    }

    async all(): Promise<Array<TimeEntry>> {
        let timeEntries = parseDtoArray<TimeEntry>(TimeEntry, await this.db.all(`SELECT * FROM time_entries ORDER BY time`));

        timeEntries = timeEntries.map<TimeEntry | null>((entry, index, array) => {
            if (index === 0 || entry.type === TimeEntryType.START) {
                return null;
            } else {
                entry.intDuration = Math.round((entry.time - array[index - 1].time) / 60000);

                return entry;
            }
        }).filter((entry) => entry !== null);

        return timeEntries;
    }

    async find(id: number): Promise<TimeEntry> {
        return parseDto<TimeEntry>(TimeEntry, await this.db.get('SELECT * FROM time_entries WHERE id = $id LIMIT 1', { '$id': id }));
    }

    async create(title: string, type: number): Promise<TimeEntry> {
        const result = await this.db.run("INSERT INTO time_entries (title, type, time, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", [
            title, type, new Date(), new Date(), new Date(),
        ]);

        return this.find(result.lastID);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.db.run("DELETE FROM time_entries WHERE id = $id", {'$id': id});

        return result.changes === 1;
    }
}
