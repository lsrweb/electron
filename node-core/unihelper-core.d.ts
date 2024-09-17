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
   * @param type 环境变量的类型，可选值为 "user" 或 "system"，默认为 "user"。
   * @returns 返回环境变量的值，如果环境变量不存在则返回空字符串。
   */
  export function getEnvVar(varName: string, type?: string): string;

  /**
   * 设置指定环境变量的值。
   * @param varName 环境变量的名称。
   * @param value 环境变量的值。
   * @param type 环境变量的类型，可选值为 "user" 或 "system"，默认为 "user"。
   * @returns 返回一个字符串，表示操作结果。
   */
  export function setEnvVar(varName: string, value: string, type?: string): string;

  /**
   * 获取 PATH 环境变量的值。
   * @param type 环境变量的类型，可选值为 "user" 或 "system"，默认为 "user"。
   * @returns 返回 PATH 环境变量的值。
   */
  export function getPathEnvVar(type?: string): string;

  /**
   * 设置 PATH 环境变量的值。
   * @param value 要设置的路径。
   * @param overwrite 是否覆盖原有路径，默认为 false。
   * @param type 环境变量的类型，可选值为 "user" 或 "system"，默认为 "user"。
   * @returns 返回一个字符串，表示操作结果。
   */
  export function setPathEnvVar(value: string, overwrite?: boolean, type?: string): string;
}
