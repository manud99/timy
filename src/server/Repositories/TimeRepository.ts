import DB from "../Services/DB";
import { TimeEntry } from "../models/TimeEntry";
import { parseDtoArray } from "../Services/DomainConverter";

export default class TimeRepository {
    private db: DB;

    constructor() {
        this.db = new DB();
    }

    async all(): Promise<Array<TimeEntry>> {
        return parseDtoArray<TimeEntry>(TimeEntry, await this.db.all('SELECT * FROM time_entries'));
    }
}
