// @ts-nocheck

import { fromJson, toJson } from "@/render_/utils";
import { app, type IpcMainEvent } from "electron";
import { existsSync, fstat, fstatSync, readFile, readFileSync, writeFileSync } from "fs";
import { errorToast } from "../errorBase";
import type { StoreController } from "../StoreController";
import {
  PROJECT_MANAGER_PATH,
  PROJECT_MANAGER_SETTINGFILE,
  UNI_BUILD_VERSION_MANAGER_SETTINGFILE,
} from "@/main_/constants";
const xml2js = require("xml2js");

type DataType = {
  dcloud_appid: string;
  package: string;
  dcloud_appkey: string;
  appname: string;
  appversion: string;
  keystore: string;
  CATCH: string;
  version: string;
  keystoreInfo: {
    alias: string;
    keystore: string;
    storepass: string;
    keypass: string;
    validity: string;
    dname: string;
    cwdPath: string;
    java: string;
  };
};

const parser = new xml2js.Parser();

const builder = new xml2js.Builder({
  xmldec: { version: "1.0", encoding: "UTF-8", standalone: null },
  renderOpts: { pretty: true, indent: "    ", newline: "\n" },
  headless: false,
  allowSurrogateChars: true,
  cdata: false,
});

// ***************DEV********************
//#region 构建项目DEVE
// 构建 deve_dcloud_control_xml
async function buildDeveDcloudControlXml(dir: string, datag: DataType, ctx: StoreController, tempDir: string) {
  try {
    console.log(`===========deve_dcloud_control_xml================`);
    console.log(dir);
    console.log(`===========deve_dcloud_control_xml================`);

    readFile(dir, "utf8", (err, dataFile) => {
      if (err) {
        console.error("读取文件失败:", err);
        return;
      }

      xml2js.parseString(dataFile, (err: any, result: { widget: any }) => {
        if (err) {
          console.error("解析 XML 失败:", err);
          return;
        }

        const app = result.hbuilder.apps[0].app[0];
        app.$.appid = datag.dcloud_appid;

        const xml = builder.buildObject(result);

        // 创建新文件
        writeFileSync(`${tempDir}\\dev\\dcloud_control.xml`, xml);
      });
    });
  } catch (error) {
    console.log(error);

    return errorToast("构建失败");
  }
}
// deve_dcloud_values_string_xml
async function buildDeveDcloudValuesStringXml(dir: string, datag: DataType, ctx: StoreController, tempDir: string) {
  try {
    console.log(`===========deve_dcloud_values_string_xml================`);
    console.log(dir);
    console.log(`===========deve_dcloud_values_string_xml================`);

    readFile(dir, "utf8", (err, data) => {
      if (err) {
        console.error("读取文件失败:", err);
        return;
      }

      parser.parseString(data, (err: any, result: { resources: { string: any[] } }) => {
        if (err) {
          console.error("解析 XML 失败:", err);
          return;
        }

        // 查找并修改 <string> 标签
        const resources = result.resources;
        const stringElement = resources.string.find((item) => item.$.name === "app_name");
        if (stringElement) {
          stringElement._ = datag.appname;
        }

        const xml = builder.buildObject(result);

        // 创建新文件
        writeFileSync(`${tempDir}\\dev\\strings.xml`, xml);
      });
    });
  } catch (error) {
    console.log(error);

    return errorToast("构建失败");
  }
}
// deve_AndroidManifest_xml
async function buildDeveAndroidManifestXml(dir: string, datag: DataType, ctx: StoreController, tempDir: string) {
  try {
    console.log(`===========deve_AndroidManifest_xml================`);
    console.log(dir);
    console.log(`===========deve_AndroidManifest_xml================`);

    readFile(dir, "utf8", (err, data) => {
      if (err) {
        console.error("读取文件失败:", err);
        return;
      }

      parser.parseString(data, (err: any, result: { manifest: { application: any[] } }) => {
        if (err) {
          console.error("解析 XML 失败:", err);
          return;
        }

        // 查找并修改 <meta-data> 标签
        const application = result.manifest.application[0];
        const metaData = application["meta-data"].find(
          (item: { $: { [x: string]: string } }) => item.$["android:name"] === "dcloud_appkey"
        );
        if (metaData) {
          metaData.$["android:value"] = datag.dcloud_appkey;
        }

        const xml = builder.buildObject(result);

        // 创建新文件
        writeFileSync(`${tempDir}\\dev\\AndroidManifest.xml`, xml);
      });
    });
  } catch (error) {
    console.log(error);

    return errorToast("构建失败");
  }
}

// 单独处理 build.gradle 文件
async function buildDeveGradleFile(dir: string, datag: DataType, ctx: StoreController, tempDir: string) {
  // ctx.deve_build_gradle

  try {
    console.log(`===========deve_build_gradle================`);
    console.log(dir);
    console.log(`===========deve_build_gradle================`);

    readFile(dir, "utf8", (err, data) => {
      if (err) {
        console.error("读取文件失败:", err);
        return;
      }
      // // 创建新文件
      const result = data
        .replace(/applicationId ".*"/, `applicationId "${datag.package}"`)
        .replace(/keyAlias '.*'/, `keyAlias '${datag.keystoreInfo.alias}'`)
        .replace(/keyPassword '.*'/, `keyPassword '${datag.keystoreInfo.keypass}'`)
        .replace(/storeFile file\('.*'\)/, `storeFile file('${datag.keystoreInfo.cwdPath}')`)
        .replace(/storePassword '.*'/, `storePassword '${datag.keystoreInfo.storepass}'`);

      writeFileSync(`${tempDir}\\dev\\build.gradle`, result);
    });
  } catch (error) {
    console.log(error);

    return errorToast("构建失败");
  }
}

//#endregion

// ***************PROD*******************
//#region 构建项目PROD
// 构建 prod_dcloud_control_xml
async function buildProdDcloudControlXml(dir: string, datag: DataType, ctx: StoreController, tempDir: string) {
  try {
    console.log(`===========prod_dcloud_control_xml================`);
    console.log(dir);
    console.log(`===========prod_dcloud_control_xml================`);

    readFile(dir, "utf8", (err, data) => {
      if (err) {
        console.error("读取文件失败:", err);
        return;
      }

      parser.parseString(data, (err: any, result: { widget: any }) => {
        if (err) {
          console.error("解析 XML 失败:", err);
          return;
        }

        const app = result.hbuilder.apps[0].app[0];
        app.$.appid = datag.dcloud_appid;

        const xml = builder.buildObject(result);

        // 创建新文件
        writeFileSync(`${tempDir}\\uniapp\\dcloud_control.xml`, xml);
      });
    });
  } catch (error) {
    console.log(error);

    return errorToast("构建失败");
  }
}
// prod_dcloud_values_string_xml
async function buildProdDcloudValuesStringXml(dir: string, datag: DataType, ctx: StoreController, tempDir: string) {
  try {
    console.log(`===========prod_dcloud_values_string_xml================`);
    console.log(dir);
    console.log(`===========prod_dcloud_values_string_xml================`);

    readFile(dir, "utf8", (err, data) => {
      if (err) {
        console.error("读取文件失败:", err);
        return;
      }

      parser.parseString(data, (err: any, result: { resources: { string: any[] } }) => {
        if (err) {
          console.error("解析 XML 失败:", err);
          return;
        }

        // 查找并修改 <string> 标签
        const resources = result.resources;
        const stringElement = resources.string.find((item) => item.$.name === "app_name");
        if (stringElement) {
          stringElement._ = datag.appname;
        }

        const xml = builder.buildObject(result);

        // 创建新文件
        writeFileSync(`${tempDir}\\uniapp\\strings.xml`, xml);
      });
    });
  } catch (error) {
    console.log(error);

    return errorToast("构建失败");
  }
}
// prod_AndroidManifest_xml
async function buildProdAndroidManifestXml(dir: string, datag: DataType, ctx: StoreController, tempDir: string) {
  try {
    console.log(`===========prod_AndroidManifest_xml================`);
    console.log(dir);
    console.log(`===========prod_AndroidManifest_xml================`);

    readFile(dir, "utf8", (err, data) => {
      if (err) {
        console.error("读取文件失败:", err);
        return;
      }

      parser.parseString(data, (err: any, result: { manifest: { application: any[] } }) => {
        if (err) {
          console.error("解析 XML 失败:", err);
          return;
        }

        // 查找并修改 <meta-data> 标签
        const application = result.manifest.application[0];
        const metaData = application["meta-data"].find(
          (item: { $: { [x: string]: string } }) => item.$["android:name"] === "dcloud_appkey"
        );
        if (metaData) {
          metaData.$["android:value"] = datag.dcloud_appkey;
        }

        const xml = builder.buildObject(result);

        // 创建新文件
        writeFileSync(`${tempDir}\\uniapp\\AndroidManifest.xml`, xml);
      });
    });
  } catch (error) {
    console.log(error);

    return errorToast("构建失败");
  }
}

// 单独处理 build.gradle 文件
async function buildProdGradleFile(dir: string, datag: DataType, ctx: StoreController, tempDir: string) {
  // ctx.prod_build_gradle

  try {
    console.log(`===========prod_build_gradle================`);
    console.log(dir);
    console.log(`===========prod_build_gradle================`);

    readFile(dir, "utf8", (err, data) => {
      if (err) {
        console.error("读取文件失败:", err);
        return;
      }
      // // 创建新文件
      const result = data
        .replace(/applicationId ".*"/, `applicationId "${datag.package}"`)
        .replace(/keyAlias '.*'/, `keyAlias '${datag.keystoreInfo.alias}'`)
        .replace(/keyPassword '.*'/, `keyPassword '${datag.keystoreInfo.keypass}'`)
        .replace(/storeFile file\('.*'\)/, `storeFile file('${datag.keystoreInfo.cwdPath}')`)
        .replace(/storePassword '.*'/, `storePassword '${datag.keystoreInfo.storepass}'`)
        .replace(/"apk.applicationId" *: *".*"/, `"apk.applicationId" : "${datag.package}"`);
      writeFileSync(`${tempDir}\\uniapp\\build.gradle`, result);
    });
  } catch (error) {
    console.log(error);

    return errorToast("构建失败");
  }
}
//#endregion

// 修改project.json
async function updateProjectJson(datag: DataType, ctx: StoreController, tempDir: string) {
  console.log(`===========project.json================`);
  console.log(datag);
  console.log(`===========project.json================`);
  console.log(tempDir);

  // PROJECT_MANAGER_SETTINGFILE(ctx.GLOBAL_DIR)
  const projectSettingFile = `${PROJECT_MANAGER_SETTINGFILE(ctx.GLOBAL_DIR)}`;

  await ctx.fileSystem.pushDataToFile(
    projectSettingFile,
    {
      dcloud_appid: datag.dcloud_appid,
      package: datag.package,
      dcloud_appkey: datag.dcloud_appkey,
      appname: datag.appname,
      appversion: datag.appversion,
      keystore: datag.keystore,
      keystoreInfo: datag.keystoreInfo,
    },
    "dcloud_appid"
  );
}

export async function createProjectCore(event: IpcMainEvent, data: any, ctx: StoreController) {
  try {
    const CATCH_DATA = fromJson(data) as DataType;
    // 判断传入 CATCH 是否存在
    if (!existsSync(CATCH_DATA.CATCH)) {
      return errorToast("路径不存在");
    }

    // 本地操作的文件夹
    const tempDir = `${PROJECT_MANAGER_PATH(ctx.GLOBAL_DIR)}\\${CATCH_DATA.dcloud_appid}`;
    // if (existsSync(tempDir)) {
    //   return errorToast("项目文件夹已存在");
    // }
    // 开始计时
    console.time("createProjectCore");

    // 使用 dcloud_appid 创建项目文件夹
    await ctx.fileSystem.createDir(tempDir);
    await ctx.fileSystem.createDir(`${tempDir}\\dev`);
    await ctx.fileSystem.createDir(`${tempDir}\\uniapp`);

    // 创建项目必要文件
    await (async () => {
      app["ws"].send(
        toJson({
          type: "info",
          message: "正在创建开发项目文件...",
        })
      );
      // 创建一个映射文件
      ctx.fileSystem.createFile(`${tempDir}\\dev\\map.json`, []);

      await buildDeveDcloudControlXml(
        `${ctx.CATCH_REPLACE_REG(CATCH_DATA.CATCH, "deve_dcloud_control_xml")}`,
        CATCH_DATA,
        ctx,
        tempDir
      );

      await buildDeveDcloudValuesStringXml(
        `${ctx.CATCH_REPLACE_REG(CATCH_DATA.CATCH, "deve_dcloud_values_string_xml")}`,
        CATCH_DATA,
        ctx,
        tempDir
      );
      await buildDeveAndroidManifestXml(
        `${ctx.CATCH_REPLACE_REG(CATCH_DATA.CATCH, "deve_AndroidManifest_xml")}`,
        CATCH_DATA,
        ctx,
        tempDir
      );
      await buildDeveGradleFile(
        `${ctx.CATCH_REPLACE_REG(CATCH_DATA.CATCH, "deve_build_gradle")}`,
        CATCH_DATA,
        ctx,
        tempDir
      );

      ctx.fileSystem.updateFile(`${tempDir}\\dev\\map.json`, {
        deve_dcloud_control_xml: `${ctx.CATCH_REPLACE_REG(CATCH_DATA.CATCH, "deve_dcloud_control_xml")}`,
        deve_dcloud_values_string_xml: `${ctx.CATCH_REPLACE_REG(CATCH_DATA.CATCH, "deve_dcloud_values_string_xml")}`,
        deve_AndroidManifest_xml: `${ctx.CATCH_REPLACE_REG(CATCH_DATA.CATCH, "deve_AndroidManifest_xml")}`,
        deve_build_gradle: `${ctx.CATCH_REPLACE_REG(CATCH_DATA.CATCH, "deve_build_gradle")}`,
      });
    })();

    await (async () => {
      app["ws"].send(
        toJson({
          type: "info",
          message: "正在创建生产项目文件...",
        })
      );

      ctx.fileSystem.createFile(`${tempDir}\\uniapp\\map.json`, []);

      // 生产
      await buildProdDcloudControlXml(
        `${ctx.CATCH_REPLACE_REG(CATCH_DATA.CATCH, "prod_dcloud_control_xml")}`,
        CATCH_DATA,
        ctx,
        tempDir
      );

      await buildProdDcloudValuesStringXml(
        `${ctx.CATCH_REPLACE_REG(CATCH_DATA.CATCH, "prod_dcloud_values_string_xml")}`,
        CATCH_DATA,
        ctx,
        tempDir
      );

      await buildProdAndroidManifestXml(
        `${ctx.CATCH_REPLACE_REG(CATCH_DATA.CATCH, "prod_AndroidManifest_xml")}`,
        CATCH_DATA,
        ctx,
        tempDir
      );

      await buildProdGradleFile(
        `${ctx.CATCH_REPLACE_REG(CATCH_DATA.CATCH, "prod_build_gradle")}`,
        CATCH_DATA,
        ctx,
        tempDir
      );

      await ctx.fileSystem.updateFile(`${tempDir}\\uniapp\\map.json`, {
        prod_dcloud_control_xml: `${ctx.CATCH_REPLACE_REG(CATCH_DATA.CATCH, "prod_dcloud_control_xml")}`,
        prod_dcloud_values_string_xml: `${ctx.CATCH_REPLACE_REG(CATCH_DATA.CATCH, "prod_dcloud_values_string_xml")}`,
        prod_AndroidManifest_xml: `${ctx.CATCH_REPLACE_REG(CATCH_DATA.CATCH, "prod_AndroidManifest_xml")}`,
        prod_build_gradle: `${ctx.CATCH_REPLACE_REG(CATCH_DATA.CATCH, "prod_build_gradle")}`,
      });
    })();

    await updateProjectJson(CATCH_DATA, ctx, tempDir);

    console.timeEnd("createProjectCore", "项目创建完成");

    // 向项目文件夹中写入children
    // UNI_BUILD_VERSION_MANAGER_SETTINGFILE(ctx.GLOBAL_DIR);
    // 读取 uni-build.json
    const uniBuildSettingFile = await ctx.fileSystem.readFile(
      `${UNI_BUILD_VERSION_MANAGER_SETTINGFILE(ctx.GLOBAL_DIR)}`
    );
    // 查询 version 等于 CATCH_DATA.version
    for (let iFind = 0; iFind < uniBuildSettingFile.length; iFind++) {
      if (uniBuildSettingFile[iFind]["version"] == CATCH_DATA.version) {
        uniBuildSettingFile[iFind]["children"].push(CATCH_DATA);
        break;
      }
    }
    console.log(uniBuildSettingFile);

    // 更新文件
    await ctx.fileSystem.updateFile(`${UNI_BUILD_VERSION_MANAGER_SETTINGFILE(ctx.GLOBAL_DIR)}`, uniBuildSettingFile);

    // console.log(uniBuildSettingFile);

    return Promise.resolve("项目创建完成");
  } catch (error) {
    console.log(error);
    return errorToast("构建失败");
  }
}
