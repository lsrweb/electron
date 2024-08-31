import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("cache", {
  // 获取缓存数据
  getData: () => ipcRenderer.invoke("StoreController:getCacheJsonFile"),
  // 设置缓存数据
  setData: (data: any) => ipcRenderer.invoke("StoreController:setCacheJsonFile", data),
  // 获取JSON指定key
  getJsonKey: (key: string) => ipcRenderer.invoke("StoreController:getJsonKey", key),
  // 设置JSON指定key
  setJsonKey: (data: object) => ipcRenderer.invoke("StoreController:setJsonKey", data),
  // 获取版本列表
  readVersionFolderData: () => ipcRenderer.invoke("StoreController:readVersionFolderData"),
  // 资源管理器
  openExplorer: (data: string) => ipcRenderer.invoke("StoreController:openExplorer", data),
});

contextBridge.exposeInMainWorld("system", {
  // 关闭应用但是不退出
  minimize: () => ipcRenderer.invoke("ScreenController:closeApp"),
  // 退出应用
  quit: () => ipcRenderer.invoke("ScreenController:quitApp"),
  // 最小化应用
  minimizeApp: () => ipcRenderer.invoke("ScreenController:minimizeApp"),
  // 最大化应用
  maximizeApp: () => ipcRenderer.invoke("ScreenController:maximizeApp"),
});

// 渲染端设置
contextBridge.exposeInMainWorld("renderSetting", () => {});

// dialog
contextBridge.exposeInMainWorld("dialog", {
  showOpenDialog: (options: Electron.OpenDialogOptions) => ipcRenderer.invoke("dialog", options),
  showSaveDialog: (options: Electron.SaveDialogOptions) => ipcRenderer.invoke("dialog", options),
});

// 获取系统信息
contextBridge.exposeInMainWorld("getSystemInfo", {
  getSystemInfo: () => ipcRenderer.invoke("getSystemInfo"),
});

// 主进程->渲染进程消息发送
contextBridge.exposeInMainWorld("electronAPI", {
  mainProcessLoaded: (callback: () => void) => ipcRenderer.on("main-process-loaded", () => callback()),

  // 通知主进程
  feedBackSuccess: (callback: () => void) => ipcRenderer.on("feedback:success", () => callback()),
});

// ********************************
// ToolsView-controller
// ********************************
contextBridge.exposeInMainWorld("tools", {
  // 获取已有 java 版本列表
  getJavaVersionList: () => ipcRenderer.invoke("ToolsController:getJavaVersionList"),
  // 设置java版本列表统一存储目录
  setJavaVersionFolder: (data: any) => ipcRenderer.invoke("ToolsController:setJavaVersionFolder", data),
  // 设置制定java版本为环境变量
  setJavaVersionAsEnv: (data: any) => ipcRenderer.invoke("ToolsController:setJavaVersionAsEnv", data),
  // 适用指定的java版本生成密钥库文件
  generateKeyStoreFile: (data: any) => ipcRenderer.invoke("ToolsController:generateKeyStoreFile", data),
});
