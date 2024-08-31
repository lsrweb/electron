import { app, type BrowserWindow, type IpcMainEvent } from "electron";
import FileStore from "../utils/cache";
import { IpcMainBaseController } from "./base";
import {
  ANDROID_VERSION_DIR,
  APPDIR,
  setEnvironmentScript,
  SETTING_JSONFILE,
} from "../constants";
import { fromJson, toJson } from "../utils";
import { existsSync } from "fs-extra";
import { executePowerShellScript } from "../utils/exec";
import { pathTrans } from "@/render_/utils";

export class StoreController extends IpcMainBaseController {
  fileSystem: FileStore;
  private window: BrowserWindow;
  private unipackINfo: any;

  constructor(windowCtx: BrowserWindow) {
    super("StoreController");

    this.fileSystem = new FileStore(windowCtx);

    this.window = windowCtx;

    // 初始化配置文件

    try {
      this.fileSystem.initializeFile(SETTING_JSONFILE, {
        STORE_PATH: APPDIR,
      });
      // 读取文件,如果文件不存在,则创建文件
      if (!existsSync(`${app.getPath("home")}/.unipack`)) {
        this.fileSystem.createFile(
          app.getPath("home") + "/.unipack",
          toJson({ HOME: `${APPDIR}` })
        );

        this.unipackINfo = { HOME: APPDIR };
      } else {
        // 读取文件
        this.unipackINfo = fromJson(
          this.fileSystem.readFile(pathTrans(`${app.getPath("home")}/.unipack`))
        );
      }
    } catch (error) {
      console.error("Failed to get environment variable:", error);
    }
  }

  /**
   * getData 获取已有缓存
   */
  public getCacheJsonFile() {
    try {
      return {
        ...this.fileSystem.readCache(SETTING_JSONFILE),
        STORE_PATH: this.unipackINfo.HOME || APPDIR,
      };
    } catch (error) {
      console.error("Failed to get environment variable:", error);
    }
  }

  /**
   * setData
   */
  public async setCacheJsonFile(event: IpcMainEvent, data: any) {
    // 读取已有配置,如果 STORE_PATH 和原有的不一样,则需要重新初始化在新目录
    const { STORE_PATH } = this.fileSystem.readCache(SETTING_JSONFILE);
    if (this.unipackINfo.HOME !== APPDIR) {
      // 更新用户环境变量 UNI_PACK_HOME
      const GET_PATH_STORE = fromJson(data).STORE_PATH;
      const GET_VERSION_PATH = fromJson(data).VERSION_PATH;

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
      setting.STORE_PATH = GET_PATH_STORE;
      setting.VERSION_PATH = GET_VERSION_PATH;

      this.fileSystem.initializeFile(
        `${GET_PATH_STORE}\\unipack\\setting.json`,
        setting
      );

      return setting;
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
    // const { VERSION_PATH } = this.fileSystem.readCache(SETTING_JSONFILE);
    // console.log("VERSION_PATH", VERSION_PATH);
    // const resultPath = existsSync(VERSION_PATH)
    //   ? VERSION_PATH
    //   : ANDROID_VERSION_DIR;
    // // 读取版本列表
    // return this.fileSystem.readDirTree(resultPath, 1, true);
    // 先读取已有配置,读取项目跟目录
  }
}
