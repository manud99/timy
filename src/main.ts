import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import gapiPlugin from "./google/plugin";
import { storeFirstOpenedTime } from "./utils/firstOpened";

storeFirstOpenedTime();

const app = createApp(App);

app.use(gapiPlugin);

app.mount("#app");
