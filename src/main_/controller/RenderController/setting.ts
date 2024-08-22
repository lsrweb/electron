import { APPDIR, SETTING_JSONFILE } from "@/main_/constants";
import { writeJsonFile } from "@/main_/utils/json";
import type { IpcMainEvent } from "electron";
import { IpcMainBaseController } from "../base";

export class RenderSettingController extends IpcMainBaseController {
  constructor() {
    super("RenderSettingController");
  }

  // 设置全局配置文件
  public async setGlobalSetting(event: IpcMainEvent, setting: any) {
    try {
      // {"versionPath":"1","configPath":"1","javaVersion":"111"}
      if (!this.validateSetting(JSON.parse(setting))) {
        throw new Error("Invalid setting");
      }
      console.log(SETTING_JSONFILE);
      // 保存配置
      writeJsonFile(SETTING_JSONFILE, JSON.parse(setting));
    } catch (error) {
      return false;
    }
  }

  // 私有方法,验证传入的配置是否合法
  private validateSetting(setting: any) {
    try {
      if (typeof setting !== "object") {
        throw new Error("Setting must be an object");
      }

      if (!setting.versionPath || typeof setting.versionPath !== "string") {
        throw new Error("Invalid versionPath");
      }

      if (!setting.configPath || typeof setting.configPath !== "string") {
        throw new Error("Invalid configPath");
      }

      if (!setting.javaVersion || typeof setting.javaVersion !== "string") {
        throw new Error("Invalid javaVersion");
      }

      return true;
    } catch (error) {
      console.error("Error validating setting:", error);
      return false;
    }
  }
}
