import { join } from "node:path";
import { app } from "electron";

export const HOME = app.getPath("documents");

export const APPDIR = join(HOME, ".unipack"),
  ANDROID_VERSION_DIR = join(APPDIR, "versions"),
  VERSIONS_FILENAME = join(APPDIR, "versions.json"),
  SETTING_JSONFILE = join(APPDIR, "settings.json"),
  PROJECTS_JSONFILE = join(APPDIR, "projects.json"),
  GROUPS_JSONFILE = join(APPDIR, "groups.json");
