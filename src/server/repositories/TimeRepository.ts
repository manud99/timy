import DB from "../services/DB";
import { TimeEntry } from "../models/TimeEntry";
import { parseDto, parseDtoArray } from "../services/DomainConverter";

export default class TimeRepository {
    private db: DB;

    constructor() {
        this.db = new DB();
    }

    async all(): Promise<Array<TimeEntry>> {
        // TODO: Get time entries from only one day.
        return parseDtoArray<TimeEntry>(TimeEntry, await this.db.all('SELECT * FROM time_entries ORDER BY start'));
    }

    async find(id: number): Promise<TimeEntry> {
        return parseDto<TimeEntry>(TimeEntry, await this.db.get('SELECT * FROM time_entries WHERE id = $id LIMIT 1', { '$id': id }));
    }

    async create(title: string, start: string, end: string | null = null): Promise<TimeEntry> {
        const result = await this.db.run("INSERT INTO time_entries (title, start, end, created_at, updated_at) VALUES ($title, $start, $end, $created_at, $updated_at)", {
            '$title': title,
            '$start': TimeRepository.formatDate(start),
            '$end': TimeRepository.formatDate(end),
            '$created_at': new Date(),
            '$updated_at': new Date(),
        });

        return this.find(result.lastID);
    }

    async update(timeEntry: TimeEntry, title: string, start: string, end: string) {
        const result = await this.db.run("UPDATE time_entries SET title = $title, start = $start, end = $end, updated_at = $updated_at WHERE id = $id", {
            '$title': title,
            '$start': TimeRepository.formatDate(start),
            '$end': TimeRepository.formatDate(end),
            '$id': timeEntry.id,
            '$updated_at': new Date(),
        });

        return result.changes === 1;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.db.run("DELETE FROM time_entries WHERE id = $id", { '$id': id });

        return result.changes === 1;
    }

    private static formatDate(strDate: string | null): Date | null {
        if (! strDate) return null;

        return new Date(strDate);
    }
}
