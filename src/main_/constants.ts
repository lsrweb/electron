import { join } from "node:path";
import { app } from "electron";
import { existsSync, mkdirSync } from "fs-extra";

export const HOME = app.getPath("documents");

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
