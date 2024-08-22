import type { IpcMainEvent } from "electron";
import FileStore from "../utils/cache";
import { IpcMainBaseController } from "./base";

export class StoreController extends IpcMainBaseController {
  fileSystem: FileStore;
  constructor() {
    super("StoreController");

    this.fileSystem = new FileStore();
  }

  get(event: IpcMainEvent, params: string) {
    return this.fileSystem.getCache(params);
  }
  set(event: IpcMainEvent, params: { key: string; value: any }) {
    const { key, value } = params;
    this.fileSystem.setCache(key, value);
  }

  clear(event: IpcMainEvent, params: string) {
    this.fileSystem.clearCache(params);
  }

  has(event: IpcMainEvent, params: string) {
    return this.fileSystem.hasCache(params);
  }
}
