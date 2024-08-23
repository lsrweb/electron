import { toJson } from "@/render_/utils";
import type { CustomApp } from "@/types/electron-app";
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
    (app as CustomApp).ws.emit("feedBack:message", toJson(resultMessage));
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
    (app as CustomApp).ws.emit("feedBack:message", toJson(resultMessage));
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
    (app as CustomApp).ws.emit("feedBack:message", toJson(resultMessage));
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
    (app as CustomApp).ws.emit("feedBack:message", toJson(resultMessage));
  }
}

export const feedBack = new FeedBack((app as CustomApp).mainWindow);
export default FeedBack;
