import type { IpcMainEvent } from "electron";
import FileStore from "../utils/cache";
import { IpcMainBaseController } from "./base";

export class StoreController extends IpcMainBaseController {
  fileSystem: FileStore;

  constructor() {
    super("StoreController");
  }
}
