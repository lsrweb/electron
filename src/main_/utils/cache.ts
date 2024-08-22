import * as fs from "fs";
import * as path from "path";
import { app, dialog } from "electron";
import { APPDIR } from "../constants";

interface FileStoreOptions {
  cacheDir?: string;
  versioned?: boolean;
  version?: string;
}

class FileStore {
  private cacheDir: string;
  private defaultFileName: string;

  constructor(options: FileStoreOptions = {}) {
    const { cacheDir = APPDIR, versioned = false, version = "" } = options;

    this.cacheDir = cacheDir;
    this.defaultFileName =
      versioned && version ? `cache_${version}.json` : "settings.json";

    const cacheFilePath = this.getCacheFilePath();
    if (!fs.existsSync(cacheFilePath)) {
      fs.writeFileSync(cacheFilePath, JSON.stringify({}));
    }

    console.log(`Cache file path: ${cacheFilePath}`);
  }

  private getCacheFilePath(fileName?: string): string {
    return path.join(this.cacheDir, fileName || this.defaultFileName);
  }

  private readCache(fileName?: string): Record<string, any> {
    const cacheFilePath = this.getCacheFilePath(fileName);
    const data = fs.readFileSync(cacheFilePath, "utf-8");
    return JSON.parse(data);
  }

  private writeCache(data: Record<string, any>, fileName?: string): void {
    const cacheFilePath = this.getCacheFilePath(fileName);
    fs.writeFileSync(cacheFilePath, JSON.stringify(data, null, 2));
  }

  public setCache(key: string, value: any, fileName?: string): void {
    const cache = this.readCache(fileName);
    cache[key] = value;
    this.writeCache(cache, fileName);
  }

  public getCache(key: string, fileName?: string): any {
    const cache = this.readCache(fileName);
    if (!cache[key]) return new Error("Key not found");
    return cache[key];
  }

  public clearCache(key: string, fileName?: string): void {
    const cache = this.readCache(fileName);
    delete cache[key];
    this.writeCache(cache, fileName);
  }

  public hasCache(key: string, fileName?: string): boolean {
    const cache = this.readCache(fileName);
    return Object.prototype.hasOwnProperty.call(cache, key);
  }

  public clearAllCache(fileName?: string): void {
    this.writeCache({}, fileName);
  }

  public exportConfig(): void {
    const cache = this.readCache();
    const filePath = dialog.showSaveDialogSync({
      title: "保存配置文件",
      defaultPath: path.join(app.getPath("documents"), "config.json"),
      filters: [{ name: "JSON 文件", extensions: ["json"] }],
    });
    if (filePath) {
      fs.writeFileSync(filePath, JSON.stringify(cache, null, 2));
    }
  }

  public importConfig(filePath: string): void {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const importedCache = JSON.parse(data);
      this.writeCache(importedCache);
    } else {
      throw new Error("文件不存在");
    }
  }

  public initializeConfig(
    fileName: string,
    initialConfig: Record<string, any>,
  ): void {
    const cacheFilePath = this.getCacheFilePath(fileName);
    if (!fs.existsSync(cacheFilePath)) {
      fs.writeFileSync(cacheFilePath, JSON.stringify(initialConfig, null, 2));
      console.log(`Initialized config file: ${cacheFilePath}`);
    } else {
      console.log(`Config file already exists: ${cacheFilePath}`);
    }
  }
}

export default FileStore;
