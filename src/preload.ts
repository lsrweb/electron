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

contextBridge.exposeInMainWorld("system", {
  // 最大化窗口
  maximize: ipcRenderer.invoke.bind(ipcRenderer, "ScreenController:maximize"),
  // 取消最大化
  unmaximize: ipcRenderer.invoke.bind(
    ipcRenderer,
    "ScreenController:unmaximize"
  ),
  // 最小化窗口
  minimize: ipcRenderer.invoke.bind(ipcRenderer, "ScreenController:minimize"),
  // 关闭窗口
  close: ipcRenderer.invoke.bind(ipcRenderer, "ScreenController:close"),
});

contextBridge.exposeInMainWorld("renderSetting", {
  // 设置全局配置文件
  setGlobalSetting: ipcRenderer.invoke.bind(
    ipcRenderer,
    "RenderSettingController:setGlobalSetting"
  ),
});
