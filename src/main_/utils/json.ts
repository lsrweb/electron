import { readFileSync, existsSync, writeFileSync } from "fs";

export function readJsonFile(filePath: string): unknown {
  if (existsSync(filePath)) {
    const data = readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } else {
    throw new Error("File not found");
  }
}

export function writeJsonFile(
  filePath: string,
  data: Record<string, any>
): void {
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}
