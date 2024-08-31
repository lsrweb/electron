import { app, type BrowserWindow, type IpcMainEvent } from "electron";
import FileStore from "../utils/cache";
import { IpcMainBaseController } from "./base";
import { APPDIR, JAVA_VERSION_MANAGER_PATH, SETTING_JSONFILE, UNI_BUILD_VERSION_MANAGER_PATH, GRADLE_VERSION_MANAGER_PATH, GLOBAL_CACHE_SETTING, HOME } from "../constants";
import { fromJson, toJson } from "../utils";
import { existsSync } from "fs-extra";
import { executePowerShellScript } from "../utils/exec";
import { pathTrans } from "@/render_/utils";

export class StoreController extends IpcMainBaseController {
  fileSystem: FileStore;
  private window: BrowserWindow;
  private GLOBAL_DIR: string;

  constructor(windowCtx: BrowserWindow) {
    super("StoreController");

    this.fileSystem = new FileStore(windowCtx);

    this.window = windowCtx;

    // 初始化配置文件

    this.initCache();
  }

  /**
   * initCache
   */
  public async initCache() {
    try {
      // C盘下创建一个全局的配置文件,存储HOME路径
      if (!existsSync(GLOBAL_CACHE_SETTING)) {
        await this.fileSystem.createFile(GLOBAL_CACHE_SETTING, {
          APP_HOME_CACHE_PATH: APPDIR,
          DEFAULT_URL: APPDIR,
          DEFAUKLT_PARENT_URL: HOME,
        });
      } else {
        // 读取全局配置文件 GLOBAL_DIR
        // @ts-ignore
        this.GLOBAL_DIR = await this.fileSystem.readFile(GLOBAL_CACHE_SETTING).APP_HOME_CACHE_PATH;
      }

      // 1.创建项目全局存储目录
      await this.fileSystem.createDir(this.GLOBAL_DIR ?? APPDIR);

      // 2.优先创建C盘下的全局配置文件
      await this.fileSystem.createFile(SETTING_JSONFILE(this.GLOBAL_DIR), {
        APP_HOME_CACHE_PATH: this.GLOBAL_DIR ?? APPDIR,
        UNI_BUILD_VERSION_MANAGER_PATH: UNI_BUILD_VERSION_MANAGER_PATH(),
        JAVA_VERSION_MANAGER_PATH: JAVA_VERSION_MANAGER_PATH(),
        GRADLE_VERSION_MANAGER_PATH: GRADLE_VERSION_MANAGER_PATH(),
      });

      // 3.配置文件初始化之后,分别创建对应的文件夹
      await this.fileSystem.createDir(UNI_BUILD_VERSION_MANAGER_PATH(this.GLOBAL_DIR));
      this.fileSystem.createDir(JAVA_VERSION_MANAGER_PATH(this.GLOBAL_DIR));
      this.fileSystem.createDir(GRADLE_VERSION_MANAGER_PATH(this.GLOBAL_DIR));

      // 读取全局配置文件 GLOBAL_DIR
      this.GLOBAL_DIR =
        // @ts-ignore
        this.fileSystem.readFile(GLOBAL_CACHE_SETTING).APP_HOME_CACHE_PATH;
    } catch (error) {
      console.error("Failed to get environment variable:", error);
    }
  }

  /**
   * getData 获取已有缓存
   */
  public getCacheJsonFile() {
    try {
      return this.fileSystem.readFile(SETTING_JSONFILE(this.GLOBAL_DIR));
    } catch (error) {
      console.error("Failed to get environment variable:", error);
    }
  }

  /**
   * setData
   */
  public async setCacheJsonFile(event: IpcMainEvent, data: any) {
    try {
      const { APP_HOME_CACHE_PATH } = fromJson(data);
      // 重置全局配置文件
      await this.fileSystem.updateFile(GLOBAL_CACHE_SETTING, {
        APP_HOME_CACHE_PATH,
      });
      this.window.reload();
    } catch (error) {
      return false;
    }
  }

  /**
   * init
   */
  public init() {}

  // 获取JSON指定key
  public getJsonKey(event: IpcMainEvent, key: string) {}

  // 设置JSON指定key
  public setJsonKey(event: IpcMainEvent, data: string) {}

  // 读取已有的版本列表
  public readVersionFolderData(event: IpcMainEvent, data: any): any {
    try {
      console.log("readVersionFolderData:", data);
      return [];
    } catch (error) {}
  }
}
