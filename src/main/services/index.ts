import type { BrowserWindow } from "electron";
import { app, ipcMain } from "electron";
import { IpcMainBaseController } from "./base";

export const enumControllerMethods = <T extends IpcMainBaseController>(
  clsInstance: T
) => {
  const result: { [key: string]: (...args: unknown[]) => any } =
    Object.create(null);
  const filterKeys = ["constructor"];
  const keys = Object.getOwnPropertyNames(clsInstance.constructor.prototype);

  keys.forEach((key) => {
    if (filterKeys.includes(key)) {
      return;
    }
    const serviceFunction = clsInstance.constructor.prototype[key];
    if (typeof serviceFunction === "function") {
      const channel = clsInstance.getChannelName(key);
      ipcMain.handle(channel, serviceFunction.bind(clsInstance));
      result[channel] = serviceFunction;
    }
  });
  return result;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const registerMainHandlers = (mainWindow: BrowserWindow) => {
  // 渲染端控制器

  // 抛出获取系统信息的方法
  ipcMain.handle("getSystemInfo", () => {
    return {
      platform: process.platform,
      arch: process.arch,
      version: process.version,

      //
      appPath: app.getAppPath(),
    };
  });

  return {};
};
