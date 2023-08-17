import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import msalPlugin from "./microsoft/plugin";
import { msalInstance } from "./microsoft/auth";
import { AuthenticationResult, EventMessage, EventType } from "@azure/msal-browser";

// Account selection logic is app dependent. Adjust as needed for different use cases.
const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
}
msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const payload = event.payload as AuthenticationResult;
        const account = payload.account;
        msalInstance.setActiveAccount(account);
    }
});

await msalInstance.initialize();

const app = createApp(App);

app.use(msalPlugin, msalInstance);

app.mount("#app");
