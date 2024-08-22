import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("cache", () => {});

contextBridge.exposeInMainWorld("system", () => {});

contextBridge.exposeInMainWorld("renderSetting", () => {});
