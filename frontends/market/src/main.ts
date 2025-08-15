import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import vuetify from "./plugins/vuetify";

import App from "./App.vue";
import { bootstrap } from "@/bootstrap";

import "./assets/main.sass";

const app = createApp(App);

app.use(createPinia());

await bootstrap();

app.use(router);
app.use(vuetify);

app.mount("#app");

