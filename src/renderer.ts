import { createApp } from "vue";

import App from "./render_/App.vue";

function bootstrap() {
  const app = createApp(App);
  app.mount("#app");
}

bootstrap();
