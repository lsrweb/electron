import type { IpcMainEvent } from "electron";
import { IpcMainBaseController } from "../base";
export class RenderSettingController extends IpcMainBaseController {
  constructor() {
    super("RenderSettingController");
  }

  // 设置全局配置文件
  public async setGlobalSetting(event: IpcMainEvent, setting: any) {
    try {
      console.log(setting);
    } catch (error) {
      return false;
    }
  }

  // 私有方法,验证传入的配置是否合法
  private validateSetting(setting: any) {
    return true;
  }
}
