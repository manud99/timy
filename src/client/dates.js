import app from "../config/app.json";

export function prepareDate(string) {
    const parts = string ? string.split(':') : null;
    if (! parts || parts.length === 0) {
        return null;
    }

    const date = new Date();
    date.setHours(parts[0], parts[1], 0, 0);

    return date.toISOString();
}

export function formatDate(string) {
    if (! string) return string;

    const date = new Date(string);

    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

export function calculateDuration(start, end) {
    const dateStart = new Date(start);
    const dateEnd = new Date(end || null);

    return Number((dateEnd.getTime() - dateStart.getTime()) / 3600000).toFixed(2);
}

export function getRoundedTime() {
    const date = new Date();
    date.setMinutes(Math.floor(date.getMinutes() / app.roundingFactor) * app.roundingFactor);

    return date;
}
