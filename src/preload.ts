// 有关如何使用预加载脚本的详细信息，请参阅 Electron 文档：
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  store: {
    get: (key: string) => ipcRenderer.invoke("store-get", key),
    set: (key: string, value: any) =>
      ipcRenderer.invoke("store-set", key, value),
  },
});
