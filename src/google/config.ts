const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const tokenConfig: google.accounts.oauth2.TokenClientConfig = {
    client_id: CLIENT_ID,
    scope: "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events.owned",
    callback: () => {},
};
