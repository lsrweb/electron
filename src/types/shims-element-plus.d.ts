// src/shims-element-plus.d.ts
import { type App } from "electron";

declare module "element-plus/dist/locale/zh-cn.min.mjs";

interface CustomApp extends App {
  ws: any;
}
