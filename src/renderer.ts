import { createApp } from "vue";
import App from "./render_/App.vue";
import "./index.css";
import router from "./render_/router/index";
import { io } from "socket.io-client";
import { ElMessage, ElNotification } from "element-plus";

import Terminal from "vue-web-terminal";
//  亮色主题：vue-web-terminal/lib/theme/light.css
import "vue-web-terminal/lib/theme/dark.css";
import * as IconList from "@heroicons/vue/24/solid";

function bootstrap() {
  const app = createApp(App);
  app.use(router);
  app.use((app: any) => {
    app.use(Terminal);
  });

  // 注册所有图标
  for (const key in IconList) {
    app.component(key, IconList[key as keyof typeof IconList]);
  }

  app.mount("#app");
}

nextTick(() => {
  setTimeout(() => {
    bootstrap();

    // 练习两年半后,关掉定时器
  }, 1250);
});

// 创建 Socket.IO 客户端
const socket = io("ws://127.0.0.1:8080");

socket.on("connect", () => {});

socket.on("message", (message) => {
  console.log(`get message: ${message}`);
  // 处理收到的消息
  try {
    const parseMessage = JSON.parse(message);
    if (parseMessage.type === "error") {
      ElMessage({
        type: "error",
        message: parseMessage.message,
        grouping: true,
      });
    }
  } catch (error) {
    console.info(error);
  }
});

socket.on("disconnect", () => {});
