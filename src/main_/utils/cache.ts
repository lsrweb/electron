import {
  readJSONSync,
  writeJSONSync,
  writeFileSync,
  readFileSync,
  existsSync,
} from "fs-extra";
import * as path from "path";
import { app, dialog, type BrowserWindow } from "electron";
import { APPDIR } from "../constants";
import { feedBack } from "./feedback";

class FileStore {
  private window: BrowserWindow;

  constructor(windowCtx?: BrowserWindow) {
    if (windowCtx) {
      this.window = windowCtx;
    }
  }

  // 私有方法,初始化指定文件,包括文件类型和初始数据
  initializeFile(fileName: string, initialData: Record<string, any>): void {
    // 写文件的时候也要判断文件是否存在,不存在则创建文件
    // 同时判断文件是否是json文件,如果是json文件,则使用writeJSONSync
    // 如果不是json文件,则使用writeFileSync

    try {
      const cacheFilePath = this.getCacheFilePath(fileName);

      // 如果文件路径存在,则不进行初始化
      if (existsSync(cacheFilePath)) {
        setTimeout(() => feedBack.success("ijjii", this.window), 1160);
        return;
      }

      // 如果文件路径不存在,则进行初始化
      if (cacheFilePath.includes(".json"))
        writeJSONSync(cacheFilePath, initialData);
      else writeFileSync(cacheFilePath, JSON.stringify(initialData));
    } catch (error) {
      feedBack.error("缓存初始化失败", this.window);
    }
  }

  /**
   * 获取缓存文件路径
   * @param fileName
   * @returns
   */
  private getCacheFilePath(fileName?: string): string {
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
  private readCache(fileName?: string): string {
    try {
      const cacheFilePath = this.getCacheFilePath(fileName);

      // 如果读取的文件路径不存在,则报错
      if (!existsSync(cacheFilePath))
        throw new Error("读取的文件路径不存在,请检查文件路径");

      // 读取文件,并返回文件内容,如果不是json文件,则使用readFileSync
      if (cacheFilePath.includes(".json"))
        return JSON.stringify(readJSONSync(cacheFilePath));
      return readFileSync(cacheFilePath, "utf-8");
    } catch (error) {
      dialog.showErrorBox("错误", "读取缓存失败");
    }
  }

  private writeCache(data: Record<string, any>, fileName?: string): void {
    try {
      const cacheFilePath = this.getCacheFilePath(fileName);
      writeJSONSync(cacheFilePath, data);
    } catch (error) {
      dialog.showErrorBox("错误", "写入缓存失败");
    }
  }

  public setCache(key: string, value: any, fileName?: string): void {
    try {
      const cacheData = JSON.parse(this.readCache(fileName));
      cacheData[key] = value;
      this.writeCache(cacheData, fileName);
    } catch (error) {
      dialog.showErrorBox("错误", "设置缓存失败");
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
}

export default FileStore;
