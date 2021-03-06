import app from "../config/app.json";

export function parseDate(string) {
    const parts = string ? string.split(':') : null;
    if (! parts || parts.length === 0) {
        return null;
    }

    const date = new Date();
    date.setHours(parts[0], parts[1], 0, 0);

    return date;
}

export function prepareDate(date) {
    return parseDate(date).toISOString();
}

export function formatDate(string) {
    if (! string) return string;

    const date = new Date(string);

    return formatIntParts(date.getHours(), date.getMinutes());
}

export function formatIntParts(hours, minutes) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function calculateDuration(start, end) {
    const dateStart = new Date(start);
    const dateEnd = new Date(end || null);

    return Math.trunc((dateEnd.getTime() - dateStart.getTime()) / 60000);
}

// TODO: Get config values via HTML from the server for updates via env vars.
export function getRoundedTime(minusNumberOfTimesRoundingFactor = 0) {
    const date = new Date();

    if (minusNumberOfTimesRoundingFactor > 0) {
        date.setMinutes(date.getMinutes() - (minusNumberOfTimesRoundingFactor * app.roundingFactor));
    }

    date.setMinutes(Math.floor(date.getMinutes() / app.roundingFactor) * app.roundingFactor);

    return date;
}

export function minutesToParts(totalMinutes) {
    const hours = Math.trunc(totalMinutes / 60);
    const minutes = totalMinutes - (hours * 60);

    return { hours, minutes };
}
