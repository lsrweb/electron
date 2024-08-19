import { createApp } from "vue";
import App from "./render_/App.vue";
import "./index.css";
import router from "./render_/router/index";

function bootstrap() {
  const app = createApp(App);
  app.use(router);
  app.mount("#app");
}

bootstrap();
