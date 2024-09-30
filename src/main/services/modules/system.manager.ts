import ORM from "../../package/db";
import { IpcMainBaseController } from "../base";

// 系统基本信息管理
export class SystemManager extends IpcMainBaseController {
  constructor() {
    super("systemManager");

    this.initDB();
  }

  private async initDB() {
    const orm = new ORM();
    orm.createTable("system", {
      id: "INTEGER PRIMARY KEY AUTOINCREMENT",
      name: "TEXT",
      value: "TEXT",
    });

    try {
      orm.insert("system", {
        name: "app",
        value: "electron-vite-react",
      });

      // 查询数据
      const result = await orm.select("system", ["name", "value"]);
      console.log(result);
    } catch (error) {
      console.error("创建表失败", error);
    }
  }
}
