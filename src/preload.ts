import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("cache", {
  // 获取缓存数据
  getData: () => ipcRenderer.invoke("StoreController:getData"),
  // 设置缓存数据
  setData: (data: any) => ipcRenderer.invoke("StoreController:setData", data),
});

contextBridge.exposeInMainWorld("system", () => {});

contextBridge.exposeInMainWorld("renderSetting", () => {});
