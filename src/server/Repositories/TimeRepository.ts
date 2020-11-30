import DB from "../Services/DB";
import { TimeEntry } from "../models/TimeEntry";
import { parseDto, parseDtoArray } from "../Services/DomainConverter";

export default class TimeRepository {
    private db: DB;

    constructor() {
        this.db = new DB();
    }

    async all(): Promise<Array<TimeEntry>> {
        let timeEntries = parseDtoArray<TimeEntry>(TimeEntry, await this.db.all('SELECT * FROM time_entries ORDER BY time ASC'));

        timeEntries = timeEntries.map<TimeEntry | null>((entry, index, array) => {
            if (index === 0) {
                return null;
            } else {
                entry.duration = Number((entry.time - array[index - 1].time) / 3600000).toFixed(2);

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
}
