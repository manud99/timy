import { App, Ref, ref } from "vue";
import { loadGoogleLibraries } from "./load";
import { googleReadyKey, tokenClientKey } from "../keys";

const ACCESS_TOKEN_KEY: string = "timy_google_access_token";

export const tokenClient: Ref<google.accounts.oauth2.TokenClient | null> = ref(null);
const accessToken = ref(window.localStorage.getItem(ACCESS_TOKEN_KEY));
const ready = ref(false);

function handleCodeResponse(res: google.accounts.oauth2.TokenResponse) {
    if (res.error !== undefined) {
        console.error("google answered with an error", res.error);
        throw res;
    }

    const accessToken = res.access_token;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    ready.value = true;
}

export default {
    install: async (app: App) => {
        app.provide(tokenClientKey, tokenClient);
        app.provide(googleReadyKey, ready);

        tokenClient.value = await loadGoogleLibraries(handleCodeResponse);

        if (accessToken.value) {
            window.gapi.client.setToken({ access_token: accessToken.value });
            ready.value = true;
        }
    },
};
