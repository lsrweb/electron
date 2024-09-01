import path, { join } from "node:path";
import { app } from "electron";
import { existsSync, mkdirSync, readJSONSync } from "fs-extra";

export const shellPath = path.resolve(__dirname, "../../shell");
export const getEnvironmentScript = path.resolve(shellPath, "get-environment.ps1");
export const setEnvironmentScript = path.resolve(shellPath, "set-environment.ps1");
export const curlScript = path.resolve(shellPath, "curl.ps1");
export const installGradleScript = path.resolve(shellPath, "install-gradle.ps1");
export const keytoolGenerateScript = path.resolve(shellPath, "keytools-gen.ps1");
export const keytoolShowScript = path.resolve(shellPath, "keytools-show.ps1");

export const GLOBAL_CACHE_SETTING = join(app.getPath("home"), ".unipack.config.json"); // 全局配置文件

export const HOME = app.getPath("documents"); // base

export const APPDIR = join(HOME, ".unipack"); // 项目全局存储目录

// uni-build版本管理目录
export const UNI_BUILD_VERSION_MANAGER_PATH = (path?: string) => join(path || APPDIR, "UNI_BUILD_VERSION");
export const UNI_BUILD_VERSION_MANAGER_SETTINGFILE = (path?: string) => join(path || APPDIR, "uni-build.json");
// java版本管理目录
export const JAVA_VERSION_MANAGER_PATH = (path?: string) => join(path || APPDIR, "JAVA_VERSION");
export const JAVA_VERSION_MANAGER_SETTINGFILE = (path?: string) => join(path || APPDIR, "java.json");
// gradle版本管理目录
export const GRADLE_VERSION_MANAGER_PATH = (path?: string) => join(path || APPDIR, "GRADLE_VERSION");
export const GRADLE_VERSION_MANAGER_SETTINGFILE = (path?: string) => join(path || APPDIR, "gradle.json");
// 密钥库管理目录
export const KEYSTORE_MANAGER_PATH = (path?: string) => join(path || APPDIR, "KEYSTORE");
export const KEYSTORE_MANAGER_SETTINGFILE = (path?: string) => join(path || APPDIR, "keystore.json");

export const VERSIONS_FILENAME = join(APPDIR, "versions.json");
export const SETTING_JSONFILE = (path?: string) => join(path || APPDIR, "settings.json");
export const PROJECTS_JSONFILE = join(APPDIR, "projects.json");
export const GROUPS_JSONFILE = join(APPDIR, "groups.json");

export const APPNAME = app.getName();
export const APPVERSION = app.getVersion();
