import { TimeEntry } from "../@types/models";
import { ready } from "./plugin";
import { showLoginModal } from "./plugin";
import { parseSubject } from "../utils/subjects";
import CustomDate from "../utils/CustomDate";

interface RequestObject {
    endpoint: string;
    method: string;
    params: object;
    body: string | null;
}

const retrySubmissionAfterLogin: RequestObject[] = [];

function parseEvent(graphItem: any): TimeEntry {
    const { subject, description } = parseSubject(graphItem.summary);
    return {
        description,
        subject,
        id: graphItem.id,
        start: new CustomDate(graphItem.start.dateTime),
        end: new CustomDate(graphItem.end.dateTime),
    };
}

export async function fetchUserInfo(): Promise<any> {
    const response = await makeRequest(
        "https://people.googleapis.com/v1/people/me",
        "GET",
        { personFields: "names,emailAddresses", fields: "names(displayName),emailAddresses(value)" },
        null
    );
    return response?.result || null;
}

export async function fetchCalendars(): Promise<gapi.client.calendar.Calendar[]> {
    const response = await makeRequest(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        "GET",
        { fields: "items(id,summary)" },
        null
    );
    return response ? response.result.items : [];
}

export async function fetchEvents(calendarId: string, start: CustomDate, end: CustomDate): Promise<TimeEntry[]> {
    const response = await makeRequest(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        "GET",
        {
            timeMin: start.toString(),
            timeMax: end.toString(),
            timeZone: "UTC",
            singleEvents: true,
            orderBy: "startTime",
            fields: "items(id,summary,start,end)",
            maxResults: 2500,
        },
        null
    );

    if (!response) return [];

    return response.result.items.map(parseEvent);
}

export async function createEvent(calendarId: string, timeEntry: TimeEntry): Promise<TimeEntry | null> {
    const body = {
        start: { dateTime: timeEntry.start.toString() },
        end: { dateTime: timeEntry.end.toString() },
        summary: timeEntry.subject?.name
            ? `[${timeEntry.subject.name}] ${timeEntry.description}`
            : timeEntry.description,
    };
    const response = await makeRequest(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        "POST",
        {},
        JSON.stringify(body)
    );

    if (!response) return null;

    return parseEvent(response.result);
}

export async function updateEvent(
    calendarId: string,
    eventId: string,
    timeEntry: TimeEntry
): Promise<TimeEntry | null> {
    const body = {
        start: { dateTime: timeEntry.start.toString() },
        end: { dateTime: timeEntry.end.toString() },
        summary: timeEntry.subject ? `[${timeEntry.subject.name}] ${timeEntry.description}` : timeEntry.description,
    };
    const response = await makeRequest(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
        "PUT",
        {},
        JSON.stringify(body)
    );

    if (!response) return null;

    return parseEvent(response.result);
}

export async function deleteEvent(calendarId: string, eventId: string): Promise<any> {
    const response = await makeRequest(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
        "DELETE",
        {},
        ""
    );

    return response && response.body === "";
}

export async function retryRequests() {
    while (retrySubmissionAfterLogin.length) {
        const { endpoint, method, params, body } = retrySubmissionAfterLogin.pop()!;
        await makeRequest(endpoint, method, params, body);
    }
}

async function makeRequest(
    endpoint: string,
    method: string,
    params: object,
    body: string | null
): Promise<gapi.client.Response<any> | null> {
    if (!ready.value) return null;

    try {
        const response = await window.gapi.client.request({
            path: endpoint,
            method,
            params,
            body,
        });
        return response;
    } catch (error: any) {
        if (error?.status === 401) {
            console.error("[GAPI]", error?.result?.error?.message);
            if (showLoginModal) showLoginModal.value = true;
            retrySubmissionAfterLogin.push({ endpoint, method, params, body });
            ready.value = false;
        } else {
            console.error("Dashboard error while loading time entries", error);
        }
        return null;
    }
}
