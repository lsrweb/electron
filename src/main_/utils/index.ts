import { log } from "node:console";

// 方法,将对象转化为JSON字符串
export function toJson(obj: any): string {
  return JSON.stringify(obj);
}

// 方法,将JSON字符串还原为JSON数据
export function fromJson(json: string): any {
  return JSON.parse(json);
}

export const compareString = (str1: string, str2: string) => {
  return str1.replace(/\s+/g, "").toLowerCase() === str2.replace(/\s+/g, "").toLowerCase();
};

export const compareStringSimilarity = (str1: string, str2: string) => {
  const len1 = str1.length;
  const len2 = str2.length;
  const maxLen = Math.max(len1, len2);
  let sameCount = 0;
  for (let i = 0; i < maxLen; i++) {
    if (str1[i] === str2[i]) {
      sameCount++;
    }
  }
  return sameCount / maxLen;
};
