import { fromJson, toJson } from "@/render_/utils";
import type { IpcMainEvent } from "electron";
import { existsSync, readFile, readFileSync } from "fs";
import { errorToast } from "../errorBase";
import type { StoreController } from "../StoreController";
import { PROJECT_MANAGER_PATH } from "@/main_/constants";

function pritterXmlData(data: string) {
  return data.replace(/>\s+</g, "><");
}

// 构建 deve_dcloud_control_xml
async function buildDeveDcloudControlXml(dir: string, data: object, ctx: StoreController, tempDir: string) {
  try {
    console.log(`===========deve_dcloud_control_xml================`);
    console.log(dir);
    console.log(`===========deve_dcloud_control_xml================`);

    const writeText = `
<hbuilder>
    <apps>
        <app appid="__UNI__A" appver=""/>
    </apps>
</hbuilder>
    `;

    ctx.fileSystem.createFile(`${tempDir}\\dcloud_control_xml.xml`, pritterXmlData(writeText));
  } catch (error) {
    console.log(error);

    return errorToast("构建失败");
  }
}

export async function createProjectCore(event: IpcMainEvent, data: any, ctx: StoreController) {
  const CATCH_DATA = fromJson(data) as {
    dcloud_appid: string;
    package: string;
    dcloud_appkey: string;
    appname: string;
    appversion: string;
    keystore: string;
    CATCH: string;
  };
  // 判断传入 CATCH 是否存在
  if (!existsSync(CATCH_DATA.CATCH)) {
    return errorToast("路径不存在");
  }

  // 本地操作的文件夹
  const tempDir = `${PROJECT_MANAGER_PATH(ctx.GLOBAL_DIR)}\\${CATCH_DATA.dcloud_appid}`;

  // 使用 dcloud_appid 创建项目文件夹
  ctx.fileSystem.createDir(tempDir);
  const dirAndroid = `${ctx.CATCH_REPLACE_REG(CATCH_DATA.CATCH, "deve_dcloud_control_xml")}`;

  // 创建项目必要文件
  await buildDeveDcloudControlXml(dirAndroid, CATCH_DATA, ctx, tempDir);
}
