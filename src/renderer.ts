import { createApp } from "vue";
import App from "./render_/App.vue";
import "./index.css";
import router from "./render_/router/index";
import { io } from "socket.io-client";

function bootstrap() {
  const app = createApp(App);
  app.use(router);
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

socket.on("connect", () => {
  console.log("Socket.IO is connected");
  // 向服务器发送消息
  socket.emit("message", "Main process Socket.IO server is connected");
});

socket.on("message", (message) => {
  console.log(`get message: ${message}`);
  // 处理收到的消息
});

socket.on("disconnect", () => {
  console.log("Socket.IO is disconnected");
});
