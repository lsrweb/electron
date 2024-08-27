import { BrowserWindow, dialog, type IpcMainEvent } from "electron";
import { IpcMainBaseController } from "./base";

export class ScreenController extends IpcMainBaseController {
  private window: BrowserWindow;

  constructor(windowCtx: BrowserWindow) {
    super("ScreenController");

    this.window = windowCtx;
  }

  // 关闭应用但是不退出
  public closeApp(event: IpcMainEvent) {
    this.window.hide();
  }

  // 退出应用
  public quitApp(event: IpcMainEvent) {
    //
    // this.window.close();
  }

  // 最小化应用
  public minimizeApp(event: IpcMainEvent) {
    this.window.minimize();
  }

  // 最大化应用
  public maximizeApp(event: IpcMainEvent) {
    this.window.maximize();
  }
}
