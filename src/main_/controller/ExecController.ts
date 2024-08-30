import type { BrowserWindow } from "electron";
import { IpcMainBaseController } from "./base";
import path from "node:path";
import { executePowerShellScript } from "../utils/exec";
import { consola, createConsola } from "consola";

// const ps1FilePath = path.resolve(__dirname, "../../shell/get-environment.ps1");

export class ExecController extends IpcMainBaseController {
  private window: BrowserWindow;

  constructor(windowCtx: BrowserWindow) {
    super("ExecController");

    this.window = windowCtx;
  }
}
