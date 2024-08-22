import { BrowserWindow, type IpcMainEvent } from "electron";
import { IpcMainBaseController } from "./base";

export class ScreenController extends IpcMainBaseController {
  private window: BrowserWindow;

  constructor(windowCtx: BrowserWindow) {
    super("ScreenController");
  }
}
