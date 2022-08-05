import { createApp } from "vue";
import App from "./App.vue";
import VueCryptojs from 'vue-cryptojs'
import store from './store'

import "./app.css";

const app = createApp(App);

app.use(store)
app.use(VueCryptojs)

app.mount("#app");
