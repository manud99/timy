<script lang="ts" setup>
import { inject, Ref } from "vue";

const tokenClient: Ref<google.accounts.oauth2.TokenClient> | undefined = inject("tokenClient");

const signIn = () => {
    if (!tokenClient) {
        console.error("Google Code Client is not initialized");
        return;
    }
    console.log("login token:", gapi.client.getToken());

    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data when establishing a new session.
        tokenClient.value.requestAccessToken({ prompt: "consent" });
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.value.requestAccessToken({ prompt: "" });
    }
};
</script>

<template>
    <button @click="signIn">Anmelden</button>
</template>
