import { forgetToken, tokenClient } from "./plugin";

export function signIn() {
    if (!tokenClient) {
        console.error("Google Code Client is not initialized");
        return;
    }

    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data when establishing a new session.
        tokenClient.value?.requestAccessToken({ prompt: "consent" });
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.value?.requestAccessToken({ prompt: "" });
    }
}

export function signOut() {
    if (!tokenClient) {
        console.error("Google Code Client is not initialized");
        return;
    }

    const accessToken = window.gapi.auth.getToken().access_token;

    if (!accessToken) return;
    google.accounts.oauth2.revoke(window.gapi.auth.getToken().access_token, () => {
        forgetToken();
    });
}
