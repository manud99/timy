import Database from '../Services/Database';

export default class TimeRepository {
    getTimeEntries() {
        return Database.exec('SELECT * FROM time_entries');
    }
}
