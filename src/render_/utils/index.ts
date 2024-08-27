import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 方法,将对象转化为JSON字符串
export function toJson(obj: any): string {
  return JSON.stringify(obj);
}

// 方法,将JSON字符串还原为JSON数据
export function fromJson(json: string): any {
  return JSON.parse(json);
}

// diff 比对两个对象的差异,返回差异的对象和差异的属性个数,如果没有差异则返回null
export function diff(
  obj1: Record<string, any>,
  obj2: Record<string, any>
): { diffObj: any; diffCount: number } | null {
  const diffObj: any = {};
  let diffCount = 0;

  for (const key in obj1) {
    if (obj1[key] !== obj2[key]) {
      diffObj[key] = obj1[key];
      diffCount++;
    }
  }

  return diffCount === 0 ? null : { diffObj, diffCount };
}
