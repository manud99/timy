import { TimeEntryType } from "../enums/TimeEntryType";
import { AbstractModel } from "./AbstractModel";

export class TimeEntry extends AbstractModel<ITimeEntry> {
    duration: string = "0.00";

    get title(): string {
        return this.state.title;
    }

    get start(): string {
        const time = new Date(this.state.time);

        return `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
    }

    get time(): number {
        return this.state.time;
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

    toJson() {
        return {
            id: this.id,
            title: this.title,
            start: this.start,
            type: this.type,
            duration: this.duration,
        };
    }
}