import { TimeEntryType } from "../enums/TimeEntryType";
import { AbstractModel } from "./AbstractModel";
import { toTimeFormat } from "../services/DateFormatter";

export class TimeEntry extends AbstractModel<ITimeEntry> {
    private _intDuration: number = 0;

    get title(): string {
        return this.state.title;
    }

    get start(): string {
        const time = new Date(this.state.time);
        console.log(this._intDuration);
        time.setMinutes(time.getMinutes() - this._intDuration);

        return toTimeFormat(time);
    }

    get end(): string {
        return toTimeFormat(new Date(this.state.time));
    }

    get duration(): string {
        console.log(Number(this._intDuration / 60));
        return Number(this._intDuration / 60).toFixed(2);
    }

    get intDuration(): number {
        return this._intDuration;
    }

    set intDuration(intDuration: number) {
        console.log('set intDuration', intDuration);
        this._intDuration = intDuration || 0;
    }

    get time(): number {
        return this.state.time;
    }

    get type(): number {
        return this.state.type as TimeEntryType;
    }

    get created_at(): string {
        return this.state.created_at;
    }

    get updated_at(): string {
        return this.state.updated_at;
    }

    toJson(): ITimeEntry {
        return {
            id: this.id,
            title: this.title,
            start: this.start,
            end: this.end,
            type: this.type,
            duration: this.duration,
        };
    }
}