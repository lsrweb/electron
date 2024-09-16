declare module 'unihelper-core' {
  /**
   * 打开文件资源管理器并导航到指定路径。
   * @param path 要打开的路径。
   * @returns 返回一个字符串，表示操作结果。
   */
  export function openExplorer(path: string): string;

  /**
   * 获取指定环境变量的值。
   * @param varName 环境变量的名称。
   * @returns 返回环境变量的值，如果环境变量不存在则返回空字符串。
   */
  export function getEnvVar(varName: string): string;

  /**
   * 设置指定环境变量的值。
   * @param varName 环境变量的名称。
   * @param value 环境变量的值。
   * @returns 返回一个字符串，表示操作结果。
   */
  export function setEnvVar(varName: string, value: string): string;
}
