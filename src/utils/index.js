import "./extend";
import bucket from "./bucket";
import http from "./http";
import { EventBus } from "quasar";
const { VITE_BASE_URL } = import.meta.env;

export default {
  install(app) {
    const global = app.config.globalProperties;
    global.$bucket = bucket;
    global.$http = http;
    global.$inDev = /foreverland/.test(VITE_BASE_URL);

    global.$openLink = (url) => {
      window.open(url);
    };

    const bus = new EventBus();
    global.$bus = bus;

    for (const func of ["toast", "alert", "confirm", "prompt", "loading", "loadingClose"]) {
      global["$" + func] = (...args) => {
        return window["$" + func](...args);
      };
    }
  },
};
