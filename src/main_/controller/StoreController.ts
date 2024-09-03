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
  setEnvironmentScript,
  setEnvironmentPathScript,
} from "../constants";
import { compareString, fromJson, toJson } from "../utils";
import { existsSync, readFileSync } from "fs-extra";
import { executeCommand, executePowerShellScript } from "../utils/exec";
import { pathReTrans, pathTrans } from "@/render_/utils";
import { errorToast } from "./errorBase";
// @ts-ignore
import xml2js from "xml2js";
import { log } from "node:console";
import { sleep } from "@/compo/env";

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
    })();
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
        // 判断GLOBAL_DIR是否存在,不存在则使用默认路径
        if (!existsSync(this.GLOBAL_DIR)) {
          this.GLOBAL_DIR = APPDIR;
        }

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
      await this.readKeyStoreSettingFile();
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

  // 打开系统终端 openTermius powershell
  public async openTermius(event: IpcMainEvent, data: any) {
    try {
      // powershell
      return executeCommand("start powershell -NoExit -NoLogo -NoProfile");
    } catch (error) {
      return errorToast("打开Termius失败");
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

      const { alias, keystore, storepass, keypass, validity, dname, java } = fromJson(data);

      // 参数验证
      const validate = [alias, keystore, storepass, keypass, validity, dname];
      for (const item of validate) {
        if (!item) {
          return errorToast(`the ${item} is required`);
        }
      }
      console.log(fromJson(data));

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
        "-javapath",
        pathReTrans(java),
      ]);

      // 创建成功后在配置文件里记录生成的信息,数组集合
      await this.fileSystem.pushDataToFile(KEYSTORE_MANAGER_SETTINGFILE(this.GLOBAL_DIR), {
        alias,
        keystore,
        storepass,
        keypass,
        validity,
        dname,
        cwdPath: `${KEYSTORE_MANAGER_PATH}\\${keystore}`,
      });

      return "生成密钥库文件成功";
    } catch (error) {
      console.log(error);

      return errorToast("生成密钥库文件失败");
    }
  }

  // 读取密钥库配置文件,剔除掉不存在的秘钥库文件,并更新配置文件
  private async readKeyStoreSettingFile() {
    try {
      const { KEYSTORE_MANAGER_PATH } = this.GLOBAL_SETTING;
      const result = Array.from(
        Object.values(await this.fileSystem.readFile(KEYSTORE_MANAGER_SETTINGFILE(this.GLOBAL_DIR)))
      );

      const resultExec = [];
      // 检测密钥库是否存在
      for (const item of result) {
        if (existsSync(item.cwdPath)) {
          resultExec.push(item);
        }
      }
      await sleep(600);
      await this.fileSystem.updateFile(KEYSTORE_MANAGER_SETTINGFILE(this.GLOBAL_DIR), resultExec, false);
    } catch (error) {
      return errorToast("读取密钥库配置文件失败");
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
      // test1.keystore
      return this.fileSystem.readDirTreeFile(KEYSTORE_MANAGER_PATH(this.GLOBAL_DIR), /\.keystore$/);
    } catch (error) {
      return errorToast("读取密钥库列表失败");
    }
  }

  // 删除指定密钥库
  public async deleteKeyStore(event: IpcMainEvent, data: any) {
    try {
      const { KEYSTORE_MANAGER_PATH } = this.GLOBAL_SETTING;

      const { keystore } = fromJson(data);

      if (!keystore) {
        return errorToast("密钥库文件不存在");
      }

      // 删除文件
      await this.fileSystem.deleteFile(`${keystore}`);
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

      // 上传文件
    } catch (error) {
      console.log(error);

      return errorToast("上传Java版本失败");
    }
  }

  /**
   * 读取Java版本列表
   * @param event
   * @param data
   * @returns
   */
  public async readJavaVersionList(event: IpcMainEvent, data: any) {
    try {
      let result = this.fileSystem.readDirTree(JAVA_VERSION_MANAGER_PATH(this.GLOBAL_DIR), 1, true, null);

      let resultExec = [];

      // 获取当前系统的 JAVA_HOME
      const resultJavaHome = await executeCommand("echo %JAVA_HOME%");

      // 进入目录,执行 bin/java -version
      for (const item of Array.from(Object.values(result))) {
        // 去除全部路径中的转义字符和空格
        const javaPath = `${item}\\bin\\java.exe`;
        const resultExecresult = await executeCommand(`"${javaPath}" -version`);
        // 匹配字符串中的 java version 或 openjdk version
        const matchVersion = /(?:java|openjdk) version "([\d._]+)"/i.exec(resultExecresult);

        const version = matchVersion ? matchVersion[1] : "未知版本";

        const active = compareString(pathTrans(resultJavaHome), pathTrans(item));

        resultExec.push({
          javaPath,
          version,
          // 追加原始路径,不拼接 bin/java.exe
          originalPath: item,
          active,
        });
      }

      this.fileSystem.updateFile(JAVA_VERSION_MANAGER_SETTINGFILE(this.GLOBAL_DIR), resultExec);

      return resultExec;
    } catch (error) {
      return errorToast("读取Java版本列表失败");
    }
  }

  /**
   * 设置Java版本到环境变量
   * @param event
   * @param data
   */
  public async setActiveJava(event: IpcMainEvent, data: any) {
    try {
      const { originalPath } = fromJson(data);
      if (!originalPath) {
        return Promise.reject("路径不存在");
      }
      // 验证传入的路径是否存在
      if (!existsSync(originalPath)) {
        return Promise.reject("路径不存在");
      }
      // 设置环境变量
      await executePowerShellScript(setEnvironmentScript, ["-name", "JAVA_HOME", "-value", originalPath, "-user"]);
      await sleep(1000);
      await executePowerShellScript(setEnvironmentPathScript, ["-Var", "JAVA_HOME", "-Sub", "\\bin"]);
    } catch (error) {
      return errorToast("设置Java版本失败");
    }
  }

  // #endregion
}
