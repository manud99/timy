export function getDate(date: string | Date): string {
    return new Date(date).toLocaleString("de-CH", { day: "2-digit", month: "long", year: "numeric" });
}

export function getIsoDate(value: string | Date): string {
    return new Date(value).toISOString().substring(0, 10);
}

export function getTime(value: string): string {
    return new Date(value).toLocaleString("de-CH", { timeStyle: "short" });
}

export function addDay(date: string, amount: number): string {
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() + amount);
    return dateObj.toISOString();
}

export function getWeekStart(fromDate: string | Date): Date {
    const date = new Date(fromDate);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - ((((date.getDay() - 1) % 7) + 7) % 7));
    return date;
}

// Source: https://weeknumber.com/how-to/javascript
export function getWeekNumber(value: string | Date): number {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

export function getWeekday(value: string | Date): string {
    return new Date(value).toLocaleString("de-CH", { weekday: "long" });
}

export function isOnSameDay(left: string | Date, right: string | Date): boolean {
    const leftDate = new Date(left);
    const rightDate = new Date(right);
    return (
        leftDate.getDate() === rightDate.getDate() &&
        leftDate.getMonth() === rightDate.getMonth() &&
        leftDate.getFullYear() === rightDate.getFullYear()
    );
}

export function isValidDate(value: string | Date): boolean {
    return !Number.isNaN(new Date(value).valueOf());
}

export function roundedToQuarterHours(date: Date): Date {
    return new Date(Math.round(date.valueOf() / 900_000) * 900_000);
}
