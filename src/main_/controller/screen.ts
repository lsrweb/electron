import { BrowserWindow } from "electron";
import { IpcMainBaseController } from "./base";

export class ScreenController extends IpcMainBaseController {
  private window: BrowserWindow;

  constructor(window: BrowserWindow) {
    super("ScreenController");
    this.window = window;
  }

  maximize() {
    this.window.maximize();
  }

  unmaximize() {
    this.window.unmaximize();
  }

  minimize() {
    this.window.minimize();
  }

  close() {
    // 兼容macOS和windows
    if (process.platform === "darwin") {
      this.window.hide();
    } else {
      this.window.close();
    }
  }
}
