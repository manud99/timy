import { ready } from "./plugin";
import { showLoginModal } from "./plugin";

export async function fetchCalendars() {
    return await makeRequest("https://www.googleapis.com/calendar/v3/users/me/calendarList", "GET", {}, null);
}

export async function fetchEvents(calendarId: string, start: string, end: string) {
    return await makeRequest(
        "https://www.googleapis.com/calendar/v3/calendars/calendarId/events",
        "GET",
        {
            calendarId: calendarId,
            timeMin: start,
            timeMax: end,
            timeZone: "UTC",
            singleEvents: true,
            orderBy: "startTime",
        },
        null
    );
}

async function makeRequest(endpoint: string, method: string, params: object, body: string | null): Promise<any> {
    if (!ready.value) return null;

    try {
        const response = await window.gapi.client.request({
            path: endpoint,
            method,
            params,
            body,
        });
        return response.result.items;
    } catch (error: any) {
        if (error?.status === 401) {
            console.error("[GAPI]", error?.result?.error?.message);
            if (showLoginModal) showLoginModal.value = true;
        } else {
            console.error("Dashboard error while loading time entries", error);
        }
        return null;
    }
}
