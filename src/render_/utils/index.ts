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
