import { App, Ref, ref } from "vue";
import { loadGoogleLibraries } from "./load";
import { retryRequests } from "./query";

const ACCESS_TOKEN_KEY: string = "timy_google_access_token";

export const tokenClient: Ref<google.accounts.oauth2.TokenClient | null> = ref(null);
export const ready = ref(false);
const accessToken = ref(window.localStorage.getItem(ACCESS_TOKEN_KEY));
export const showLoginModal: Ref<boolean> = ref(!accessToken.value);

function handleCodeResponse(res: google.accounts.oauth2.TokenResponse) {
    if (res.error !== undefined) {
        console.error("google answered with an error", res.error);
        throw res;
    }

    const accessToken = res.access_token;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    ready.value = true;
    retryRequests();
}

export function forgetToken() {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, "");
    window.gapi.client.setToken({ access_token: "" });
}

export default {
    install: async (app: App) => {
        tokenClient.value = await loadGoogleLibraries(handleCodeResponse);

        if (accessToken.value) {
            window.gapi.client.setToken({ access_token: accessToken.value });
            ready.value = true;
        }
    },
};
