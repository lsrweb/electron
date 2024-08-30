import { app, type BrowserWindow, type IpcMainEvent } from "electron";
import FileStore from "../utils/cache";
import { IpcMainBaseController } from "./base";
import {
  ANDROID_VERSION_DIR,
  APPDIR,
  setEnvironmentScript,
  SETTING_JSONFILE,
} from "../constants";
import { fromJson } from "../utils";
import { existsSync } from "fs-extra";
import { executePowerShellScript } from "../utils/exec";

export class StoreController extends IpcMainBaseController {
  fileSystem: FileStore;
  private window: BrowserWindow;

  constructor(windowCtx: BrowserWindow) {
    super("StoreController");

    this.fileSystem = new FileStore(windowCtx);

    this.window = windowCtx;

    // 初始化配置文件
    this.fileSystem.initializeFile(SETTING_JSONFILE, {
      STORE_PATH: APPDIR,
    });
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
  public async setCacheJsonFile(event: IpcMainEvent, data: any) {
    // 读取已有配置,如果 STORE_PATH 和原有的不一样,则需要重新初始化在新目录
    const { STORE_PATH } = this.fileSystem.readCache(SETTING_JSONFILE);
    if (STORE_PATH !== fromJson(data).STORE_PATH) {
      // 更新用户环境变量 UNI_PACK_HOME

      // try {
      //   await executePowerShellScript(setEnvironmentScript, [
      //     "-name",
      //     "UNI_PACK_HOME",
      //     "-value",
      //     fromJson(data).STORE_PATH + "/.unipack",
      //     "-user",
      //   ]);
      // } catch (error) {
      //   console.error("Failed to set environment variable:", error);
      // }

      // 在 user 目录下创建 .unipack 文件,并写入 HOME 变量
      console.log(app.getPath("home"), 'app.getPath("home")');

      this.fileSystem.createFile(
        app.getPath("home"),
        JSON.stringify({ HOME: fromJson(data).STORE_PATH + "/.unipack" })
      );
      // 创建文件夹
      await this.fileSystem.createDir(fromJson(data).STORE_PATH + "/.unipack");

      this.fileSystem.initializeFile(
        fromJson(data).STORE_PATH + "/.unipack",
        data
      );

      return;
    }

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
