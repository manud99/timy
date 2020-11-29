import DB from "../Services/DB";

export default class TimeRepository {
    private db: DB;

    constructor() {
        this.db = new DB()
    }

    getTimeEntries() {
        return this.db.get('SELECT * FROM time_entries');
    }
}
