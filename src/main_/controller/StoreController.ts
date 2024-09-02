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
  KEYSTORE_MANAGER_PATH,
  KEYSTORE_MANAGER_SETTINGFILE,
  GRADLE_VERSION_MANAGER_SETTINGFILE,
  JAVA_VERSION_MANAGER_SETTINGFILE,
  UNI_BUILD_VERSION_MANAGER_SETTINGFILE,
  keytoolGenerateScript,
  keytoolShowScript,
} from "../constants";
import { fromJson, toJson } from "../utils";
import { existsSync, readFileSync } from "fs-extra";
import { executeCommand, executePowerShellScript } from "../utils/exec";
import { pathReTrans, pathTrans } from "@/render_/utils";
import { errorToast } from "./errorBase";
// @ts-ignore
import xml2js from "xml2js";
import consola from "consola";

export class StoreController extends IpcMainBaseController {
  fileSystem: FileStore;
  private window: BrowserWindow;
  private GLOBAL_DIR: any;
  private GLOBAL_SETTING: any;

  constructor(windowCtx?: BrowserWindow) {
    super("StoreController");

    this.fileSystem = new FileStore(windowCtx);

    this.window = windowCtx as BrowserWindow | undefined;

    // 初始化配置文件
    (async () => {
      await this.initCache();
      this.generateKeyStoreFile(
        null,
        JSON.stringify({
          alias: "test1",
          keystore: "test1.keystore",
          storepass: "123456",
          keypass: "123456",
          validity: "365",
          dname: "CN=www.test.com,OU=ID,O=TEST,L=BJ,ST=BJ,C=CN",
          // keystore: "test.keystore",
          // storepass: "123456",
        })
      );
    })();

    // this.initCache().then(() => {
    //   // this.createProject();

    // });
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
        KEYSTORE_MANAGER_PATH: KEYSTORE_MANAGER_PATH(this.GLOBAL_DIR),
      });

      // 3.配置文件初始化之后,分别创建对应的文件夹
      await this.fileSystem.createDir(UNI_BUILD_VERSION_MANAGER_PATH(this.GLOBAL_DIR));
      await this.fileSystem.createFile(UNI_BUILD_VERSION_MANAGER_SETTINGFILE(this.GLOBAL_DIR), {});

      await this.fileSystem.createDir(JAVA_VERSION_MANAGER_PATH(this.GLOBAL_DIR));
      await this.fileSystem.createFile(JAVA_VERSION_MANAGER_SETTINGFILE(this.GLOBAL_DIR), {});

      await this.fileSystem.createDir(GRADLE_VERSION_MANAGER_PATH(this.GLOBAL_DIR));
      await this.fileSystem.createFile(GRADLE_VERSION_MANAGER_SETTINGFILE(this.GLOBAL_DIR), {});

      await this.fileSystem.createDir(KEYSTORE_MANAGER_PATH(this.GLOBAL_DIR));
      await this.fileSystem.createFile(KEYSTORE_MANAGER_SETTINGFILE(this.GLOBAL_DIR), []);

      // ------------------------------
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
      const CATCH_DATA = fromJson(data);
      // 判断传入 CATCH 是否存在
      if (!existsSync(CATCH_DATA.CATCH)) {
        return errorToast("路径不存在");
      }
      console.log(CATCH_DATA);

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

  // ********************************
  // KEYSTORE
  // ********************************
  // #region KEYSTORE
  // 生成密钥库文件
  public async generateKeyStoreFile(event: IpcMainEvent, data: any) {
    try {
      const { KEYSTORE_MANAGER_PATH } = this.GLOBAL_SETTING;

      const { alias, keystore, storepass, keypass, validity, dname } = fromJson(data);

      // 参数验证
      const validate = [alias, keystore, storepass, keypass, validity, dname];
      for (const item of validate) {
        if (!item) {
          return errorToast(`参数 ${item} 不能为空`);
        }
      }

      await executePowerShellScript(keytoolGenerateScript, [
        "-keystore",
        pathTrans(KEYSTORE_MANAGER_PATH) + "\\" + keystore,
        "-alias",
        alias,
        "-keyalg",
        "RSA",
        "-keysize",
        "2048",
        "-validity",
        validity,
        "-storepass",
        storepass,
        "-keypass",
        keypass,
        "-dname",
        dname,
      ]);

      // 创建成功后在配置文件里记录生成的信息,数组集合
      this.fileSystem.pushDataToFile(KEYSTORE_MANAGER_SETTINGFILE(this.GLOBAL_DIR), {
        alias,
        keystore,
        storepass,
        keypass,
        validity,
        dname,
        cwdPath: `${KEYSTORE_MANAGER_PATH}\\${keystore}`,
      });
    } catch (error) {
      return errorToast("生成密钥库文件失败");
    }
  }

  // 读取密钥库文件
  public async readKeyStoreFile(event: IpcMainEvent, data: any) {
    try {
      const { KEYSTORE_MANAGER_PATH } = this.GLOBAL_SETTING;

      const { keystore, storepass } = fromJson(data);
      const resultExec = await executePowerShellScript(keytoolShowScript, [
        "-keystore",
        pathTrans(KEYSTORE_MANAGER_PATH) + "\\" + keystore,
        "-storepass",
        storepass,
      ]);

      return resultExec;
    } catch (error) {
      return errorToast("读取密钥库文件失败");
    }
  }

  // 读取密钥库列表
  public async readKeyStoreList(event: IpcMainEvent, data: any) {
    try {
      return this.fileSystem.readFile(KEYSTORE_MANAGER_SETTINGFILE(this.GLOBAL_DIR));
    } catch (error) {
      return errorToast("读取密钥库列表失败");
    }
  }

  // 删除指定密钥库
  public async deleteKeyStore(event: IpcMainEvent, data: any) {
    try {
      const { KEYSTORE_MANAGER_PATH } = this.GLOBAL_SETTING;

      const { keystore } = fromJson(data);

      await this.fileSystem.deleteFile(KEYSTORE_MANAGER_PATH + "\\" + keystore);
    } catch (error) {
      return errorToast("删除密钥库失败");
    }
  }
  // #endregion

  // ********************************
  // JAVA MANAGER
  // ********************************
  // #region JAVA manager

  /**
   * 上传 java 压缩包
   * @param event
   * @param data
   */
  public async uplodJavaVersion(event: IpcMainEvent, data: any) {
    try {
      const { JAVA_VERSION_MANAGER_PATH } = this.GLOBAL_SETTING;

      const { path } = fromJson(data);

      // 上传文件
      await this.fileSystem.uploadFile(pathReTrans(path), JAVA_VERSION_MANAGER_PATH);
    } catch (error) {
      return errorToast("上传Java版本失败");
    }
  }

  public async readJavaVersionList(event: IpcMainEvent, data: any) {
    try {
      return this.fileSystem.readDirTree(JAVA_VERSION_MANAGER_PATH(this.GLOBAL_DIR), 1, true, /java/);
    } catch (error) {
      return errorToast("读取Java版本列表失败");
    }
  }

  // #endregion
}
