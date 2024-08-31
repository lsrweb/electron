import type { BrowserWindow, IpcMainEvent } from "electron";
import { IpcMainBaseController } from "./base";

export class ToolsController extends IpcMainBaseController {
  private window: BrowserWindow;

  constructor(window: BrowserWindow) {
    super("ToolsController");

    this.window = window;

    // 床架默认的java版本列表统一存储目录 G:\uni-app-outbuild-sdk\java_oracle
  }

  // ********************************
  // 设置java版本列表统一存储目录
  public setJavaVersionFolder(event: IpcMainEvent, data: any): void {}

  // 获取已有 java 版本列表
  public getJavaVersionList(): any {
    return [];
  }

  // 设置制定java版本为环境变量
  public setJavaVersionAsEnv(event: IpcMainEvent, data: any): void {}

  // 适用指定的java版本生成密钥库文件
  public generateKeyStoreFile(event: IpcMainEvent, data: any): void {}

  // ********************************

  // gradle
}
