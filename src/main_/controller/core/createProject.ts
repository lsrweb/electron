// @ts-nocheck

import { fromJson, toJson } from "@/render_/utils";
import type { IpcMainEvent } from "electron";
import { existsSync, fstat, readFile, readFileSync, writeFileSync } from "fs";
import { errorToast } from "../errorBase";
import type { StoreController } from "../StoreController";
import { PROJECT_MANAGER_PATH } from "@/main_/constants";
const xml2js = require("xml2js");

type DataType = {
  dcloud_appid: string;
  package: string;
  dcloud_appkey: string;
  appname: string;
  appversion: string;
  keystore: string;
  CATCH: string;
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

        console.log(xml);

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

// ***************PROD********************
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

        console.log(xml);

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

export async function createProjectCore(event: IpcMainEvent, data: any, ctx: StoreController) {
  try {
    const CATCH_DATA = fromJson(data) as DataType;
    // 判断传入 CATCH 是否存在
    if (!existsSync(CATCH_DATA.CATCH)) {
      return errorToast("路径不存在");
    }

    // 本地操作的文件夹
    const tempDir = `${PROJECT_MANAGER_PATH(ctx.GLOBAL_DIR)}\\${CATCH_DATA.dcloud_appid}`;

    // 使用 dcloud_appid 创建项目文件夹
    ctx.fileSystem.createDir(tempDir);
    ctx.fileSystem.createDir(`${tempDir}\\dev`);
    ctx.fileSystem.createDir(`${tempDir}\\uniapp`);

    // 创建项目必要文件
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
  } catch (error) {
    console.log(error);
    return errorToast("构建失败");
  }
}
