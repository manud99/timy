import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import gapiPlugin from "./google/plugin";
import { autoStartDay } from "./utils/timeKeeper";

autoStartDay();

const app = createApp(App);

app.use(gapiPlugin);

app.mount("#app");
