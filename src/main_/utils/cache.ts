import { readJSONSync, writeJSONSync, writeFileSync, readFileSync, existsSync, readdirSync, statSync, mkdirSync } from "fs-extra";
import * as path from "path";
import { app, dialog, type BrowserWindow } from "electron";
import { APPDIR } from "../constants";
import { feedBack } from "./feedback";
import type { CustomApp } from "@/types/electron-app";
import { pathReTrans } from "@/render_/utils";
import { toJson } from ".";

class FileStore {
  private window: BrowserWindow;

  constructor(windowCtx?: BrowserWindow) {
    if (windowCtx) {
      this.window = windowCtx;
    }
  }

  // 私有方法,初始化指定文件,包括文件类型和初始数据
  public initializeFile(fileName: string, initialData: Record<string, any>): void {
    // 写文件的时候也要判断文件是否存在,不存在则创建文件
    // 同时判断文件是否是json文件,如果是json文件,则使用writeJSONSync
    // 如果不是json文件,则使用writeFileSync

    try {
      const cacheFilePath = this.getCacheFilePath(fileName);

      // 将数据写入文件,写入的是JSON,需要将数据转换成JSON格式
      if (typeof initialData !== "object") {
        initialData = JSON.parse(initialData);
      }

      console.log(app.getPath("documents"));

      // 如果文件路径不存在,则进行初始化
      if (!existsSync(cacheFilePath)) {
        if (cacheFilePath.includes(".json")) {
          writeJSONSync(cacheFilePath, initialData, {
            spaces: 2,
            EOL: "\r\n",
          });
        } else writeFileSync(cacheFilePath, JSON.stringify(initialData));
      }
      // 如果存在,且文件内容不为空,则将新旧数据合并,写入文件
      else {
        const cacheData = readJSONSync(cacheFilePath);
        if (!cacheData || !initialData) return;
        const newData = { ...cacheData, ...initialData };

        if (cacheFilePath.includes(".json")) {
          writeJSONSync(cacheFilePath, newData, {
            spaces: 2,
            EOL: "\r\n",
          });
        } else writeFileSync(cacheFilePath, JSON.stringify(newData));
      }
    } catch (error) {
      feedBack.error("缓存初始化失败", this.window);
    }
  }

  /**
   * 获取缓存文件路径
   * @param fileName
   * @returns
   */
  public getCacheFilePath(fileName?: string): string {
    try {
      // 文件名可能传入的是整个路径,所以需要判断
      if (fileName && fileName.includes(".json")) return fileName;

      // 如果没有传入文件名,则使用默认的文件名
      const cacheDir = path.join(APPDIR, "cache");
      if (!existsSync(cacheDir)) writeFileSync(cacheDir, "");

      return path.join(cacheDir, fileName || "cache.json");
    } catch (error) {
      dialog.showErrorBox("错误", "获取缓存文件路径失败");
    }
  }

  /**
   * 读取缓存
   * @param fileName
   * @returns
   */
  public readCache(fileName?: string): Record<string, object> | string | void | any {
    try {
      const cacheFilePath = this.getCacheFilePath(fileName);

      // 如果读取的文件路径不存在,则报错
      if (!existsSync(cacheFilePath)) throw new Error("读取的文件路径不存在,请检查文件路径");

      // 读取文件,并返回文件内容,如果不是json文件,则使用readFileSync
      if (cacheFilePath.includes(".json")) return readJSONSync(cacheFilePath);
      return readFileSync(cacheFilePath, "utf-8");
    } catch (error) {
      dialog.showErrorBox("错误", error);
    }
  }

  public writeCache(data: Record<string, any>, fileName?: string): void {
    try {
      const cacheFilePath = this.getCacheFilePath(fileName);
      writeJSONSync(cacheFilePath, data, {
        spaces: 2,
        EOL: "\r\n",
      });
    } catch (error) {
      dialog.showErrorBox("错误", error);
    }
  }

  public setCache(key: string, value: any, fileName?: string): void {
    try {
      if (!fileName) return;

      if (fileName.includes(".json")) {
        const cacheData = readJSONSync(this.getCacheFilePath(fileName));
        if (cacheData[key] === value || !key || !value) return;
        cacheData[key] = value;
        Object.assign(cacheData, { [key]: value });

        this.writeCache(cacheData, fileName);
      }
    } catch (error) {
      dialog.showErrorBox("错误", error);
    }
  }

  public getCache(key: string, fileName?: string): any {
    try {
      const cacheData = JSON.parse(this.readCache(fileName));
      return cacheData[key];
    } catch (error) {
      dialog.showErrorBox("错误", "获取缓存失败");
    }
  }

  public clearCache(key: string, fileName?: string): void {
    try {
      const cacheData = JSON.parse(this.readCache(fileName));
      delete cacheData[key];
      this.writeCache(cacheData, fileName);
    } catch (error) {
      dialog.showErrorBox("错误", "清除缓存失败");
    }
  }

  public hasCache(key: string, fileName?: string): boolean {
    try {
      const cacheData = JSON.parse(this.readCache(fileName));
      return cacheData[key] !== undefined;
    } catch (error) {
      dialog.showErrorBox("错误", "判断缓存是否存在失败");
      return false;
    }
  }

  public clearAllCache(fileName?: string): void {
    try {
      this.writeCache({}, fileName);
    } catch (error) {
      dialog.showErrorBox("错误", "清除所有缓存失败");
    }
  }

  // 读取传入指定绝对路径下指定层数文件夹名称树
  public readDirTree(dir: string, depth: number, flatten: boolean = false, filterRegex: RegExp | null = /^Android/): Record<string, any> | string[] {
    if (!existsSync(dir)) return flatten ? [] : {};
    const result: Record<string, any> = {};
    const dirName = path.basename(dir);
    result[dirName] = {};

    if (depth === 0) return flatten ? [] : result;

    const items = readdirSync(dir);
    const flatResult: string[] = [];

    items.forEach((item: string) => {
      const itemPath = pathReTrans(path.join(dir, item));

      // 检查当前目录是否匹配正则表达式
      if (statSync(itemPath).isDirectory() && (!filterRegex || filterRegex.test(item))) {
        if (depth > 0) {
          const subTree = this.readDirTree(itemPath, depth - 1, flatten, filterRegex);
          if (flatten && Array.isArray(subTree)) {
            flatResult.push(...subTree);
          } else {
            result[dirName][item] = subTree;
          }
        }
        if (flatten) {
          flatResult.push(itemPath);
        }
      }
    });

    return flatten ? flatResult : result;
  }

  // 创建文件夹
  public createDir(dir: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true, mode: 0o777 });
        }
        resolve();
      } catch (error) {
        console.log(error);
        reject(new Error("创建文件夹失败"));
      }
    });
  }

  public createFile(filePath: string, data?: object): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (filePath.includes(".json")) {
          writeJSONSync(filePath, data || {}, {
            spaces: 2,
            EOL: "\r\n",
          });
        } else {
          writeFileSync(filePath, toJson(data) || "", {
            encoding: "utf-8",
          });
        }
        resolve();
      } catch (error) {
        console.log(error);
        reject(new Error("创建文件失败"));
      }
    });
  }

  public updateFile(filePath: string, data: object): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (filePath.includes(".json")) {
          const cacheData = readJSONSync(filePath);
          if (!cacheData || !data) return;
          const newData = { ...cacheData, ...data };

          writeJSONSync(filePath, newData, {
            spaces: 2,
            EOL: "\r\n",
          });
        } else {
          writeFileSync(filePath, toJson(data) || "", {
            encoding: "utf-8",
          });
        }
        resolve();
      } catch (error) {
        console.log(error);
        reject(new Error("更新文件失败"));
      }
    });
  }

  public readFile(filePath: string): Promise<object | string> {
    return new Promise((resolve, reject) => {
      try {
        if (filePath.includes(".json")) {
          resolve(readJSONSync(filePath));
        } else {
          resolve(readFileSync(filePath, "utf-8"));
        }
      } catch (error) {
        console.log(error);
        reject(new Error(error instanceof Error ? error.message : "读取文件失败"));
      }
    });
  }
}

export default FileStore;
