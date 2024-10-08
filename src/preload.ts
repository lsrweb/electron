import { contextBridge, ipcRenderer } from "electron";
import path from "path";

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

  // ********************************
  // program
  // ********************************
  createProject: (data: any) => ipcRenderer.invoke("StoreController:createProject", data),
  openTermius: (data: any) => ipcRenderer.invoke("StoreController:openTermius", data),

  // ********************************
  // keystore
  // ********************************
  // 生成密钥库
  generateKeyStoreFile: (data: any) => ipcRenderer.invoke("StoreController:generateKeyStoreFile", data),
  // 显示密钥库
  readKeyStoreFile: (data: any) => ipcRenderer.invoke("StoreController:readKeyStoreFile", data),
  // 读取密钥库列表
  readKeyStoreList: () => ipcRenderer.invoke("StoreController:readKeyStoreList"),
  // 删除密钥库
  deleteKeyStore: (data: any) => ipcRenderer.invoke("StoreController:deleteKeyStore", data),
  // 读取密钥库秘钥配置信息
  readKeyStoreInfo: (data: any) => ipcRenderer.invoke("StoreController:readKeyStoreInfo", data),

  // ********************************
  // Java
  // ********************************
  // 读取Java版本列表
  readJavaVersionList: () => ipcRenderer.invoke("StoreController:readJavaVersionList"),
  // 上传Java版本
  uplodJavaVersion: (data: any) => ipcRenderer.invoke("StoreController:uplodJavaVersion", data),
  // 设置Java版本为环境变量
  setActiveJava: (data: any) => ipcRenderer.invoke("StoreController:setActiveJava", data),
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

  startDrag: (fileName: any) => ipcRenderer.send("ondragstart", path.join(__dirname, fileName)),
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
