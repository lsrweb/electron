/**
 * 系统基础TS字典配置
 */

import { app } from "electron";

export const systemConfig = {
  // 项目配置文件存储位置
  CONFIG_DB_PATH: app.getAppPath(),
  // 应用所有数据存放位置
  CONFIG_APP_DATASAVE_PATH: app.getPath("userData"),
  // NOW_USERING_JAVA
  NOW_USERING_JAVA: "",
  // NOW_USEING_JAVA_PATH
  NOW_USEING_JAVA_PATH: "",
};
