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
import { pathTrans } from "@/render_/utils";

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

    // 读取文件,如果文件不存在,则创建文件
    if (!existsSync(`${app.getPath("home")}/.unipack`)) {
      this.fileSystem.createFile(app.getPath("home") + "/.unipack", "{}");
    }
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
      const GET_PATH_STORE = fromJson(data).STORE_PATH;

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

      //

      // 创建文件夹
      await this.fileSystem.createDir(pathTrans(`${GET_PATH_STORE}\\unipack`));
      await this.fileSystem.createFile(
        app.getPath("home") + "/.unipack",
        JSON.stringify({
          HOME: pathTrans(`${GET_PATH_STORE}`),
        })
      );

      // 读取原有配置,并写入新的配置
      const setting = this.fileSystem.readCache(SETTING_JSONFILE);
      setting.STORE_PATH = fromJson(data).STORE_PATH;
      this.fileSystem.initializeFile(
        `${GET_PATH_STORE}\\unipack\\setting.json`,
        setting
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
