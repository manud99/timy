import { App, Ref, ref } from "vue";
import { loadGoogleLibraries } from "./load";

const ACCESS_TOKEN_KEY: string = "timy_google_access_token";

const gapi = ref({});
const tokenClient = ref({});
const accessToken = ref(window.localStorage.getItem(ACCESS_TOKEN_KEY));
const ready = ref(false);

function handleCodeResponse(res: google.accounts.oauth2.TokenResponse) {
    if (res.error !== undefined) {
        throw res;
    }
    const accessToken = res.access_token;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    console.log("token client callback", res);
    ready.value = true;
}

export default {
    install: async (app: App) => {
        app.provide("gapi", gapi);
        app.provide("tokenClient", tokenClient);
        app.provide("googleReady", ready);

        const res = await loadGoogleLibraries(handleCodeResponse);
        gapi.value = res[0];
        tokenClient.value = res[1];

        if (accessToken.value) {
            window.gapi.client.setToken({ access_token: accessToken.value });
            ready.value = true;
        }
    },
};
