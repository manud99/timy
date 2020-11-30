import { TimeEntryType } from "../enums/TimeEntryType";

export class TimeEntry {
    private state: ITimeEntry = {};

    get id() {
        return this.state.id;
    }

    get title() {
        return this.state.title;
    }

    get time() {
        const time = new Date(this.state.time);

        return `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
    }

    get type() {
        return this.state.type as TimeEntryType;
    }

    get created_at() {
        return this.state.created_at;
    }

    get updated_at() {
        return this.state.updated_at;
    }
}