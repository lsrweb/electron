import { toJson } from "@/render_/utils";
import { app, type BrowserWindow } from "electron";
import type { Socket } from "socket.io";

class FeedBack {
  private window: BrowserWindow;
  appWssContect: Socket;
  constructor(windowCtx?: BrowserWindow) {
    this.window = windowCtx;

    // eslint-disable-next-line
    // @ts-ignore
    this.appWssContect = app["ws"];
  }

  public success(message: string, windowCtx?: BrowserWindow) {
    if (!this.window && windowCtx) this.window = windowCtx;
    const resultMessage = {
      type: "success",
      message,
    };
    if (!this.window) return;

    app["ws"].emit("message", toJson(resultMessage));
  }

  /**
   * error
   */
  public error(message: string, windowCtx?: BrowserWindow) {
    if (!this.window && windowCtx) this.window = windowCtx;
    const resultMessage = {
      type: "error",
      message,
    };
    if (!this.window) return;
    this.window.webContents.send("feedback:error", resultMessage);
  }

  /**
   * warning
   */
  public warning(message: string, windowCtx?: BrowserWindow) {
    if (!this.window && windowCtx) this.window = windowCtx;
    const resultMessage = {
      type: "warning",
      message,
    };
    if (!this.window) return;
    this.window.webContents.send("feedback:warning", resultMessage);
  }

  /**
   * info
   */
  public info(message: string, windowCtx?: BrowserWindow) {
    if (!this.window && windowCtx) this.window = windowCtx;
    const resultMessage = {
      type: "info",
      message,
    };
    if (!this.window) return;
    this.window.webContents.send("feedback:info", resultMessage);
  }
}

export const feedBack = new FeedBack(app["mainWindow"]);
export default FeedBack;
