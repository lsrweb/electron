import ORM from "../../package/db";
import { IpcMainBaseController } from "../base";
import { systemConfig } from "../contain";

/**
 * SystemManager
 * @class SystemManager
 * @extends IpcMainBaseController
 * @description
 * 系统配置管理
 * 用于管理系统配置信息
 */

export class SystemManager extends IpcMainBaseController {
  private systemDB_CONFIG = {
    label: "TEXT PRIMARY KEY",
    value: "TEXT",
    dvalue: "TEXT",
  };

  private uniSdkVersionDB_CONFIG = {
    path: "TEXT PRIMARY KEY",
    version: "TEXT",
    createTime: "TEXT",
  };

  private javaVersionDB_CONFIG = {
    path: "TEXT PRIMARY KEY",
    version: "TEXT",
    createTime: "TEXT",
  };

  constructor() {
    super("SystemManager");

    this.initDB();
  }

  private async initDB(config?: { dbPath: string }) {
    try {
      const orm = new ORM();
      // 判断是否第一次初始化
      if (!(await orm.isFirstInit())) return;
      await orm.createTable("system", this.systemDB_CONFIG);
      // 初始化uni-离线sdk版本表
      await orm.createTable("uni_sdk_version", this.uniSdkVersionDB_CONFIG);
      // 初始化java版本表
      await orm.createTable("java_version", this.javaVersionDB_CONFIG);
      // 初始化配置
      for (const key in systemConfig) {
        if (Object.prototype.hasOwnProperty.call(systemConfig, key)) {
          const element = systemConfig[key as keyof typeof systemConfig];
          await orm.insert("system", {
            label: key,
            value: "",
            dvalue: element,
          });
        }
      }
    } catch (error) {
      console.error("initDB error", error);
    }
  }

  public async updateConfig(key: string, value: string) {
    try {
      console.log("updateConfig", key, value);
    } catch (error) {
      console.error("updateConfig error", error);
    }
  }
}
