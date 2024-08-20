// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  // 开放存储
  storage: {
    get: ipcRenderer.invoke.bind(ipcRenderer, "StoreController:get"),
    set: ipcRenderer.invoke.bind(ipcRenderer, "StoreController:set"),
    clear: ipcRenderer.invoke.bind(ipcRenderer, "StoreController:clear"),
    has: ipcRenderer.invoke.bind(ipcRenderer, "StoreController:has"),
    clearAll: ipcRenderer.invoke.bind(ipcRenderer, "StoreController:clearAll"),
    exportConfig: ipcRenderer.invoke.bind(
      ipcRenderer,
      "StoreController:exportConfig"
    ),
    importConfig: ipcRenderer.invoke.bind(
      ipcRenderer,
      "StoreController:importConfig"
    ),
  },
});
