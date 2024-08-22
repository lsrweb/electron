import { readdirSync, statSync, mkdirSync, existsSync } from "fs";

// 读取指定目录下的第一层文件夹
export function readFolder(path: string): string[] {
  return readdirSync(path).filter((file) => {
    return statSync(`${path}/${file}`).isDirectory();
  });
}

// 搜索指定目录下的所有文件夹中的某几个文件
export function searchFilesInFolders(
  folders: string[],
  searchFiles: string[]
): string[] {
  const result: string[] = [];
  folders.forEach((folder) => {
    searchFiles.forEach((file) => {
      if (readdirSync(folder).includes(file)) {
        result.push(`${folder}/${file}`);
      }
    });
  });
  return result;
}

// 判断传入路径的文件夹是否存在,不存在则创建文件夹,并返回文件路径
export function checkFolderExist(path: string): string {
  if (!existsSync(path)) {
    mkdirSync(path);
  }
  return path;
}
