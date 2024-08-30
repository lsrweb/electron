import path, { join } from "node:path";
import { app } from "electron";
import { existsSync, mkdirSync, readFileSync } from "fs-extra";
import { executePowerShellScript } from "./utils/exec";

export const shellPath = path.resolve(__dirname, "../../shell");
export const getEnvironmentScript = path.resolve(
  shellPath,
  "get-environment.ps1"
);
export const setEnvironmentScript = path.resolve(
  shellPath,
  "set-environment.ps1"
);
export const curlScript = path.resolve(shellPath, "curl.ps1");
export const installGradleScript = path.resolve(
  shellPath,
  "install-gradle.ps1"
);

// let HomeEnv;
// (async () => {
//   try {
//     HomeEnv = await executePowerShellScript(getEnvironmentScript, [
//       "-name",
//       "UNI_PACK_HOME",
//     ]);
//     console.log("HomeEnv:", HomeEnv);
//   } catch (error) {
//     console.error("Failed to get environment variable:", error);
//   }
// })();

// 判断 C 盘 user 下是否有 .unipack 文件,有就读取其中的 HOME 变量
let HomeEnv = (
  function () {
    try {
      // const data = readFileSync(
      //   app.getPath("home") + "/.unipack",
      //   "utf8"
      // );
      // return JSON.parse(data).HOME;
    } catch (error) {
      console.error("Failed to get environment variable:", error);
    }
  } as any
)();

export const HOME = HomeEnv || app.getPath("documents");

export const APPDIR = join(HOME, ".unipack"),
  ANDROID_VERSION_DIR = join(APPDIR, "versions"),
  VERSIONS_FILENAME = join(APPDIR, "versions.json"),
  SETTING_JSONFILE = join(APPDIR, "settings.json"),
  PROJECTS_JSONFILE = join(APPDIR, "projects.json"),
  GROUPS_JSONFILE = join(APPDIR, "groups.json");

export const APPNAME = app.getName();
export const APPVERSION = app.getVersion();

// 自动创建指定目录
export const createDir = (dir: string) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
};

// 创建目录
createDir(APPDIR);
createDir(ANDROID_VERSION_DIR);
