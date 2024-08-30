import type { BrowserWindow } from "electron";
import { app, ipcMain } from "electron";
import { IpcMainBaseController } from "./base";
import { ScreenController } from "./ScreenController";
import { StoreController } from "./StoreController";
import { ExecController } from "./ExecController";

export const enumControllerMethods = <T extends IpcMainBaseController>(
  clsInstance: T
) => {
  // eslint-disable-next-line no-unused-vars
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
  const store = new StoreController(mainWindow);
  const screen = new ScreenController(mainWindow);
  const exec = new ExecController(mainWindow);

  enumControllerMethods(store);
  enumControllerMethods(screen);
  enumControllerMethods(exec);

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

  return {
    store,
    screen,
    exec,
  };
};
