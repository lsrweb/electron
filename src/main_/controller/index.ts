import { ipcMain } from "electron";
import type { BrowserWindow } from "electron";
import { IpcMainBaseController } from "./base";
import { StoreController } from "./storeControll";

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
export const registerMainHanlders = (mainWindow: BrowserWindow) => {
  const store = new StoreController();

  enumControllerMethods(store);

  const controllers = {
    store,
  };

  return controllers;
};
