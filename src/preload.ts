import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("cache", {
  // 获取缓存数据
  getData: () => ipcRenderer.invoke("StoreController:getData"),
  // 设置缓存数据
  setData: (data: any) => ipcRenderer.invoke("StoreController:setData", data),
  // 获取JSON指定key
  getJsonKey: (key: string) =>
    ipcRenderer.invoke("StoreController:getJsonKey", key),
  // 设置JSON指定key
  setJsonKey: (key: string, value: any) =>
    ipcRenderer.invoke("StoreController:setJsonKey", key, value),
});

contextBridge.exposeInMainWorld("system", () => {});

// 渲染端设置
contextBridge.exposeInMainWorld("renderSetting", () => {});

// 主进程->渲染进程消息发送
contextBridge.exposeInMainWorld("electronAPI", {
  mainProcessLoaded: (callback: () => void) =>
    ipcRenderer.on("main-process-loaded", () => callback()),

  // 通知主进程
  feedBackSuccess: (callback: () => void) =>
    ipcRenderer.on("feedback:success", () => callback()),
});
