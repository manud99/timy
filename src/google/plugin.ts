import { App, Ref, ref } from "vue";
import { loadGoogleLibraries } from "./load";
import { retryRequests } from "./query";

const ACCESS_TOKEN_KEY: string = "timy_google_access_token";
const ACCESS_TOKEN_TIMEOUT_KEY: string = "timy_google_access_token_timeout";

export const tokenClient: Ref<google.accounts.oauth2.TokenClient | null> = ref(null);
export const ready = ref(false);
export const readyToFetch = ref(false);
const accessToken = ref(window.localStorage.getItem(ACCESS_TOKEN_KEY));
const accessTokenTimeout = ref(window.localStorage.getItem(ACCESS_TOKEN_TIMEOUT_KEY));
export const showLoginModal: Ref<boolean> = ref(!accessToken.value);

function forgetTokenAfterTimeout() {
    if (!accessTokenTimeout.value) return;

    const now = new Date();
    const timestamp = new Date(parseInt(accessTokenTimeout.value));
    setTimeout(forgetToken, timestamp.valueOf() - now.valueOf());
}

function handleCodeResponse(res: google.accounts.oauth2.TokenResponse) {
    if (res.error !== undefined) {
        console.error("google answered with an error", res.error);
        throw res;
    }

    const accessToken = res.access_token;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    // access token is valid for one hour
    window.localStorage.setItem(ACCESS_TOKEN_TIMEOUT_KEY, (new Date().valueOf() + 3600000).toString());
    forgetTokenAfterTimeout();
    ready.value = true;
    retryRequests().then(() => (readyToFetch.value = !readyToFetch.value));
}

export function forgetToken() {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(ACCESS_TOKEN_TIMEOUT_KEY);
    ready.value = false;
    window.gapi.client.setToken({ access_token: "" });
}

export default {
    install: async (app: App) => {
        tokenClient.value = await loadGoogleLibraries(handleCodeResponse);

        if (accessToken.value) {
            window.gapi.client.setToken({ access_token: accessToken.value });
            forgetTokenAfterTimeout();
            ready.value = true;
            readyToFetch.value = !readyToFetch.value;
        }
    },
};
