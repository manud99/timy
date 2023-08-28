import { inject, Ref } from "vue";
import { tokenClient } from "./plugin";
import { tokenClientKey } from "../keys";

export const signIn = () => {
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
};
