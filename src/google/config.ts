const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const apiConfig = {
    apiKey: API_KEY,
};

export const tokenConfig: google.accounts.oauth2.TokenClientConfig = {
    client_id: CLIENT_ID,
    scope: "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events.owned",
    callback: () => {},
};
