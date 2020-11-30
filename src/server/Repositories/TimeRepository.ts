import DB from "../Services/DB";

export default class TimeRepository {
    private db: DB;

    constructor() {
        this.db = new DB()
    }

    all() {
        return this.db.all('SELECT * FROM time_entries');
    }
}
