export default class CustomDate {
    readonly date: Readonly<Date>;

    constructor(val: string | Date) {
        if (val instanceof Date) {
            this.date = val;
        } else {
            this.date = new Date(val);
        }
    }

    // Output time in various formats
    toString(): string {
        return this.date.toISOString();
    }

    valueOf(): number {
        return this.date.valueOf();
    }

    toDateString(): string {
        const year = this.getYear().toString();
        const month = this.getMonth().toString().padStart(2, "0");
        const day = this.getDay().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    getDate(): string {
        return this.date.toLocaleString("de-CH", { day: "2-digit", month: "long", year: "numeric" });
    }

    getFullDate(): string {
        return this.date.toLocaleString("de-CH", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
    }

    getShortDate(): string {
        const day = this.getDay().toString().padStart(2, "0");
        const month = this.getMonth().toString().padStart(2, "0");
        return `${day}.${month}.`;
    }

    getIsoDate(): string {
        return this.date.toISOString().substring(0, 10);
    }

    getTime(): string {
        return this.date.toLocaleString("de-CH", { timeStyle: "short" });
    }

    getYear(): number {
        return this.date.getFullYear();
    }

    getMonth(): number {
        return this.date.getMonth() + 1;
    }

    getDay(): number {
        return this.date.getDate();
    }

    getWeekday(): string {
        return this.date.toLocaleString("de-CH", { weekday: "long" });
    }

    getWeekNumber(): number {
        // Source: https://weeknumber.com/how-to/javascript
        const date = new Date(this.date);
        date.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
        // January 4 is always in week 1.
        const week1 = new Date(date.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
    }

    getHoursSinceMidnight(): number {
        return this.date.getHours() + this.date.getMinutes() / 60;
    }

    diff(other: CustomDate): number {
        return this.date.valueOf() - other.date.valueOf();
    }

    diffInMinutes(other: CustomDate): number {
        return this.diff(other) / 60_000;
    }

    // Boolean checks
    isValidDate(): boolean {
        return !Number.isNaN(this.date.valueOf());
    }

    isOnSameDay(other: CustomDate): boolean {
        return (
            this.date.getDate() === other.date.getDate() &&
            this.date.getMonth() === other.date.getMonth() &&
            this.date.getFullYear() === other.date.getFullYear()
        );
    }

    isToday(): boolean {
        return this.isOnSameDay(CustomDate.now());
    }

    isSmallerThan(other: CustomDate): boolean {
        return this.date.valueOf() < other.date.valueOf();
    }

    isBiggerThan(other: CustomDate): boolean {
        return this.date.valueOf() > other.date.valueOf();
    }

    // Modifiers
    static now(): CustomDate {
        return new CustomDate(new Date());
    }

    clone(): CustomDate {
        return new CustomDate(new Date(this.date));
    }

    addMonths(amount: number): CustomDate {
        const dateObj = new Date(this.date);
        dateObj.setMonth(dateObj.getMonth() + amount);
        return new CustomDate(dateObj);
    }

    addDays(amount: number): CustomDate {
        const dateObj = new Date(this.date);
        dateObj.setDate(dateObj.getDate() + amount);
        return new CustomDate(dateObj);
    }

    addHours(amount: number): CustomDate {
        const dateObj = new Date(this.date);
        dateObj.setHours(dateObj.getHours() + amount);
        return new CustomDate(dateObj);
    }

    addMinutes(amount: number): CustomDate {
        const dateObj = new Date(this.date);
        dateObj.setMinutes(dateObj.getMinutes() + amount);
        return new CustomDate(dateObj);
    }

    setToWeekStart(): CustomDate {
        const date = new Date(this.date);
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - ((((date.getDay() - 1) % 7) + 7) % 7));
        return new CustomDate(date);
    }

    roundedToQuarterHours(): CustomDate {
        return new CustomDate(new Date(Math.round(this.date.valueOf() / 900_000) * 900_000));
    }

    max(other: CustomDate): CustomDate {
        if (other.date.valueOf() >= this.date.valueOf()) {
            return other;
        }
        return this;
    }
}
