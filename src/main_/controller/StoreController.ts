import { app, type BrowserWindow, type IpcMainEvent } from "electron";
import FileStore from "../utils/cache";
import { IpcMainBaseController } from "./base";
import { APPDIR, SETTING_JSONFILE } from "../constants";

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
  public getCacheJsonFile() {}

  /**
   * setData
   */
  public setCacheJsonFile(event: IpcMainEvent, data: any) {}

  /**
   * init
   */
  public init() {}

  // 获取JSON指定key
  public getJsonKey(event: IpcMainEvent, key: string) {
    console.log("getJsonKey");
  }

  // 设置JSON指定key
  public setJsonKey(event: IpcMainEvent, key: string, value: any) {}
}
