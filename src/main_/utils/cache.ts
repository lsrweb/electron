import * as fs from "fs";
import * as path from "path";
import { app, dialog } from "electron";

interface FileStoreOptions {
  cacheDir?: string;
  versioned?: boolean;
  version?: string;
}

class FileStore {
  private cacheFilePath: string;

  constructor(options: FileStoreOptions = {}) {
    const {
      cacheDir = app.getPath("documents"),
      versioned = false,
      version = "",
    } = options;

    const fileName =
      versioned && version ? `cache_${version}.json` : "cache.json";
    this.cacheFilePath = path.join(cacheDir, fileName);

    if (!fs.existsSync(this.cacheFilePath)) {
      fs.writeFileSync(this.cacheFilePath, JSON.stringify({}));
    }

    console.log(`Cache file path: ${this.cacheFilePath}`);
  }

  private readCache(): Record<string, any> {
    const data = fs.readFileSync(this.cacheFilePath, "utf-8");
    return JSON.parse(data);
  }

  private writeCache(data: Record<string, any>): void {
    fs.writeFileSync(this.cacheFilePath, JSON.stringify(data, null, 2));
  }

  public setCache(key: string, value: any): void {
    const cache = this.readCache();
    cache[key] = value;
    this.writeCache(cache);
  }

  public getCache(key: string): any {
    const cache = this.readCache();
    if (!cache[key]) return new Error("Key not found");
    return cache[key];
  }

  public clearCache(key: string): void {
    const cache = this.readCache();
    delete cache[key];
    this.writeCache(cache);
  }

  public hasCache(key: string): boolean {
    const cache = this.readCache();
    return Object.prototype.hasOwnProperty.call(cache, key);
  }

  public clearAllCache(): void {
    this.writeCache({});
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
}

export default FileStore;
