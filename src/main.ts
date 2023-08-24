import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import gapiPlugin from "./google/plugin";

const app = createApp(App);

app.use(gapiPlugin);

app.mount("#app");
