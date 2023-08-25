import { apiConfig, tokenConfig } from "./config";

let gapiLoaded = false;
let gsiLoaded = false;
let tokenClient: google.accounts.oauth2.TokenClient | null = null;

export function loadGoogleLibraries(
    handleCodeResponse: (tokenResponse: google.accounts.oauth2.TokenResponse) => void
): Promise<google.accounts.oauth2.TokenClient> {
    return new Promise((resolve) => {
        const element = document.getElementsByTagName("script")[0];

        function maybeResolve() {
            if (!gapiLoaded || !gsiLoaded || !tokenClient) return;
            resolve(tokenClient);
        }

        async function initializeGapiClient() {
            await gapi.client.init(apiConfig);
            gapiLoaded = true;
            maybeResolve();
        }

        const gapiScript = document.createElement("script");
        gapiScript.id = "google-api";
        gapiScript.src = "https://apis.google.com/js/api.js";
        gapiScript.async = true;
        gapiScript.defer = true;
        element.parentNode?.insertBefore(gapiScript, element);
        gapiScript.onload = async () => {
            gapi.load("client", initializeGapiClient);
        };

        const gsiScript = document.createElement("script");
        gsiScript.id = "gsi-client";
        gsiScript.src = "https://accounts.google.com/gsi/client";
        gsiScript.async = true;
        gsiScript.defer = true;
        element.parentNode?.insertBefore(gsiScript, element);
        gsiScript.onload = () => {
            tokenConfig.callback = handleCodeResponse;
            tokenClient = window.google.accounts.oauth2.initTokenClient(tokenConfig);
            gsiLoaded = true;
            maybeResolve();
        };
    });
}
