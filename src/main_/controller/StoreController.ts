import { app, type BrowserWindow, type IpcMainEvent } from "electron";
import FileStore from "../utils/cache";
import { IpcMainBaseController } from "./base";
import { ANDROID_VERSION_DIR, APPDIR, SETTING_JSONFILE } from "../constants";
import { fromJson } from "../utils";
import { existsSync } from "fs-extra";

export class StoreController extends IpcMainBaseController {
  fileSystem: FileStore;
  private window: BrowserWindow;

  constructor(windowCtx: BrowserWindow) {
    super("StoreController");

    this.fileSystem = new FileStore(windowCtx);

    this.window = windowCtx;

    // 初始化配置文件
    this.fileSystem.initializeFile(SETTING_JSONFILE, {});
  }

  /**
   * getData
   */
  public getCacheJsonFile() {
    return this.fileSystem.readCache(SETTING_JSONFILE);
  }

  /**
   * setData
   */
  public setCacheJsonFile(event: IpcMainEvent, data: any) {
    return this.fileSystem.initializeFile(SETTING_JSONFILE, data);
  }

  /**
   * init
   */
  public init() {}

  // 获取JSON指定key
  public getJsonKey(event: IpcMainEvent, key: string) {
    console.log("getJsonKey");
  }

  // 设置JSON指定key
  public setJsonKey(event: IpcMainEvent, data: string) {
    const { key, value } = fromJson(data);
    this.fileSystem.setCache(key, value, SETTING_JSONFILE);
  }

  // 读取已有的版本列表
  public readVersionFolderData(event: IpcMainEvent, data: any) {
    // 先读取已有配置
    const { versionPath } = this.fileSystem.readCache(SETTING_JSONFILE);
    const resultPath = existsSync(versionPath)
      ? versionPath
      : ANDROID_VERSION_DIR;

    // 读取版本列表
    return this.fileSystem.readDirTree(resultPath, 1, true);
  }
}
