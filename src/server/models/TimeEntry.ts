import { AbstractModel } from "./AbstractModel";
import { toTimeFormat } from "../services/DateFormatter";

export class TimeEntry extends AbstractModel<DbTimeEntry, ApiTimeEntry> {
    get title(): string {
        return this.state.title;
    }

    set title(title: string) {
        this.state.title = title;
    }

    get start(): string {
        return toTimeFormat(new Date(this.state.start));
    }

    set start(start: string) {
        this.state.start = Number(start);
    }

    get end(): string {
        if (! this.state.end) {
            return null;
        }

        return toTimeFormat(new Date(this.state.end));
    }

    set end(end: string) {
        this.state.end = Number(end);
    }

    get duration(): string {
        let endTime = this.state.end;
        if (! endTime) {
            endTime = new Date().getTime();
        }

        return Number((endTime - this.state.start) / 3600000)
            .toFixed(2);
    }

    get created_at(): string {
        return new Date(this.state.created_at).toISOString();
    }

    get updated_at(): string {
        return new Date(this.state.updated_at).toISOString();
    }

    toJson(): ApiTimeEntry {
        return {
            id: this.id,
            title: this.title,
            start: this.start,
            end: this.end,
            duration: this.duration,
        };
    }
}