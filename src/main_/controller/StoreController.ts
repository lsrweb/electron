import { app, dialog, type BrowserWindow, type IpcMainEvent } from "electron";
import FileStore from "../utils/cache";
import { IpcMainBaseController } from "./base";
import {
  APPDIR,
  JAVA_VERSION_MANAGER_PATH,
  SETTING_JSONFILE,
  UNI_BUILD_VERSION_MANAGER_PATH,
  GRADLE_VERSION_MANAGER_PATH,
  GLOBAL_CACHE_SETTING,
  HOME,
} from "../constants";
import { fromJson, toJson } from "../utils";
import { existsSync, readFileSync } from "fs-extra";
import { executeCommand, executePowerShellScript } from "../utils/exec";
import { pathReTrans, pathTrans } from "@/render_/utils";
import { errorToast } from "./errorBase";
// @ts-ignore
import xml2js from "xml2js";

export class StoreController extends IpcMainBaseController {
  fileSystem: FileStore;
  private window: BrowserWindow;
  private GLOBAL_DIR: any;
  private GLOBAL_SETTING: any;

  constructor(windowCtx: BrowserWindow) {
    super("StoreController");

    this.fileSystem = new FileStore(windowCtx);

    this.window = windowCtx;

    // 初始化配置文件

    this.initCache();

    this.createProject();
  }

  /**
   * initCache
   */
  public async initCache() {
    try {
      // C盘下创建一个全局的配置文件,存储HOME路径
      if (!existsSync(GLOBAL_CACHE_SETTING)) {
        await this.fileSystem.createFile(GLOBAL_CACHE_SETTING, {
          APP_HOME_CACHE_PATH: APPDIR,
          DEFAULT_URL: APPDIR,
          DEFAUKLT_PARENT_URL: HOME,
        });
      } else {
        // 读取全局配置文件 GLOBAL_DIR
        // @ts-ignore
        const APP_CACHE: any = await this.fileSystem.readFile(GLOBAL_CACHE_SETTING);
        this.GLOBAL_DIR = APP_CACHE["APP_HOME_CACHE_PATH"];

        this.GLOBAL_SETTING = await this.fileSystem.readFile(SETTING_JSONFILE(this.GLOBAL_DIR));
      }

      // 1.创建项目全局存储目录
      await this.fileSystem.createDir(this.GLOBAL_DIR ?? APPDIR);

      // 2.优先创建C盘下的全局配置文件
      await this.fileSystem.createFile(SETTING_JSONFILE(this.GLOBAL_DIR), {
        APP_HOME_CACHE_PATH: this.GLOBAL_DIR ?? APPDIR,
        UNI_BUILD_VERSION_MANAGER_PATH: UNI_BUILD_VERSION_MANAGER_PATH(this.GLOBAL_DIR),
        JAVA_VERSION_MANAGER_PATH: JAVA_VERSION_MANAGER_PATH(this.GLOBAL_DIR),
        GRADLE_VERSION_MANAGER_PATH: GRADLE_VERSION_MANAGER_PATH(this.GLOBAL_DIR),
      });

      // 3.配置文件初始化之后,分别创建对应的文件夹
      await this.fileSystem.createDir(UNI_BUILD_VERSION_MANAGER_PATH(this.GLOBAL_DIR));
      this.fileSystem.createDir(JAVA_VERSION_MANAGER_PATH(this.GLOBAL_DIR));
      this.fileSystem.createDir(GRADLE_VERSION_MANAGER_PATH(this.GLOBAL_DIR));
    } catch (error) {
      console.error("Failed to get environment variable:", error);

      return errorToast("初始化缓存数据失败");
    }
  }

  /**
   * getData 获取已有缓存
   */
  public async getCacheJsonFile() {
    try {
      return await this.fileSystem.readFile(SETTING_JSONFILE(this.GLOBAL_DIR));
    } catch (error) {
      console.error("Failed to get environment variable:", error);
      return errorToast("获取缓存数据失败");
    }
  }

  /**
   * setData
   */
  public async setCacheJsonFile(event: IpcMainEvent, data: any) {
    try {
      const { APP_HOME_CACHE_PATH } = fromJson(data);
      // 重置全局配置文件
      await this.fileSystem.updateFile(GLOBAL_CACHE_SETTING, {
        APP_HOME_CACHE_PATH,
      });
    } catch (error) {
      return errorToast("设置缓存数据失败");
    }
  }

  // 获取JSON指定key
  public getJsonKey(event: IpcMainEvent, key: string) {}

  // 设置JSON指定key
  public setJsonKey(event: IpcMainEvent, data: string) {}

  // 读取已有的版本列表
  public readVersionFolderData(event: IpcMainEvent, data: any): any {
    try {
      const { UNI_BUILD_VERSION_MANAGER_PATH } = this.GLOBAL_SETTING;

      return this.fileSystem.readDirTree(UNI_BUILD_VERSION_MANAGER_PATH, 1, true);
    } catch (error) {
      return errorToast("读取版本列表失败");
    }
  }

  // 传入路径,使用资源管理器打开
  public async openExplorer(event: IpcMainEvent, path: string) {
    try {
      if (!existsSync(fromJson(path).cwd)) {
        return errorToast("路径不存在");
      }

      return executeCommand(`start explorer ${fromJson(path).cwd}`);
    } catch (error) {
      return errorToast("打开资源管理器失败");
    }
  }

  // dev
  private deve_dcloud_control_xml = `<CATCH>\\HBuilder-Integrate-AS\\simpleDemo\\src\\main\\assets\\data\\dcloud_control.xml`;
  private deve_dcloud_values_string_xml = `<CATCH>\\HBuilder-Integrate-AS\\simpleDemo\\src\\main\\res\\values\\strings.xml`;
  private deve_AndroidManifest_xml = `<CATCH>\\HBuilder-Integrate-AS\\simpleDemo\\src\\main\\AndroidManifest.xml`;
  private deve_build_gradle = `<CATCH>\\HBuilder-Integrate-AS\\simpleDemo\\build.gradle`;

  // prod
  private prod_dcloud_control_xml = `<CATCH>\\HBuilder-HelloUniApp\\app\\src\\main\\assets\\data\\dcloud_control.xml`;
  private prod_dcloud_values_string_xml = `<CATCH>\\HBuilder-HelloUniApp\\app\\src\\main\\res\\values\\strings.xml`;
  private prod_AndroidManifest_xml = `<CATCH>\\HBuilder-HelloUniApp\\app\\src\\main\\AndroidManifest.xml`;
  private prod_build_gradle = `<CATCH>\\HBuilder-HelloUniApp\\app\\build.gradle`;

  // 将路径中的 <CATCH> 替换为传入的路径组成新的路径返回
  private CATCH_REPLACE_REG(CATCH: string, path: string) {
    // return this.dcloud_control_xml.replace(/<CATCH>/, CATCH);
    switch (path) {
      case "deve_dcloud_control_xml":
        return this.deve_dcloud_control_xml.replace(/<CATCH>/, CATCH);
      case "deve_dcloud_values_string_xml":
        return this.deve_dcloud_values_string_xml.replace(/<CATCH>/, CATCH);
      case "deve_AndroidManifest_xml":
        return this.deve_AndroidManifest_xml.replace(/<CATCH>/, CATCH);
      case "deve_build_gradle":
        return this.deve_build_gradle.replace(/<CATCH>/, CATCH);
      case "prod_dcloud_control_xml":
        return this.prod_dcloud_control_xml.replace(/<CATCH>/, CATCH);
      case "prod_dcloud_values_string_xml":
        return this.prod_dcloud_values_string_xml.replace(/<CATCH>/, CATCH);
      case "prod_AndroidManifest_xml":
        return this.prod_AndroidManifest_xml.replace(/<CATCH>/, CATCH);
      case "prod_build_gradle":
        return this.prod_build_gradle.replace(/<CATCH>/, CATCH);
      default:
        return path;
    }
  }

  // 创建一个项目
  public async createProject(event?: IpcMainEvent, data?: any) {
    try {
      // 存在则创建项目
      const parserXml = new xml2js.Parser();
      const builder = new xml2js.Builder();

      // G:\uniHelperBuiler\UNI_BUILD_VERSION\Android-SDK@4.24.82145_20240723\HBuilder-Integrate-AS\simpleDemo\src\main\assets\data\dcloud_control.xml
      const { CATCH } = fromJson(data);
      // 判断传入 CATCH 是否存在
      if (!existsSync(CATCH)) {
        return errorToast("路径不存在");
      }

      //

      // parserXml.parseString(
      //   readFileSync(
      //     // `\\HBuilder-Integrate-AS\\simpleDemo\\src\\main\\assets\\data\\dcloud_control.xml`
      //     // 将路径中的标识符拼接上其他路径
      //   ),
      //   (err: any, result: any) => {
      //     console.log(err, JSON.stringify(result));
      //     //  { hbuilder: { apps: [{ app: [{ $: { appid: "__UNI__A", appver: "" } }] }] } };
      //     // 修改 appid 为 __UNI__B
      //     result.hbuilder.apps[0].app[0].$.appid = "__UNI__B";
      //     const xml = builder.buildObject(result);
      //     console.log(xml);
      //   }
      // );
    } catch (error) {
      return errorToast("创建项目失败");
    }
  }

  // 构建apk包
  public async buildApkFile(event: IpcMainEvent, data: any) {}
}
