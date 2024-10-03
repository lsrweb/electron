import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("system", {
  updateConfig: (e) => ipcRenderer.invoke("SystemManager:updateConfig", e),
});
