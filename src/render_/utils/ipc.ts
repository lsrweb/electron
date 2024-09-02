import { fromJson, toJson } from "@r/utils/index";
import { ElNotification } from "element-plus";

class IpcMainMess {
  private elNotification: any;

  // 私有方法,将数据格式化成字符串
  private formatData(data: any) {
    return toJson(data);
  }

  // 私有方法,将字符串格式化成数据
  private parseData(data: string) {
    return fromJson(data);
  }

  /**
   * Dynamically calls a method on the `window` object based on a string path.
   *
   * @private
   * @param {string} path - The dot-separated string path to the method on the `window` object.
   * @param {...any} args - The arguments to pass to the method.
   * @returns {any} - The result of the method call, if successful.
   * @throws Will throw an error if the method is not found or is not a function.
   */
  private chainCall(path: string, ...args: any[]): any {
    try {
      const parts = path.split(".");
      let method = window as any;

      for (const part of parts) {
        if (method[part] === undefined) {
          throw new Error(`Method ${path} not found on window object`);
        }
        method = method[part];
      }

      if (typeof method !== "function") {
        throw new Error(`${path} is not a function`);
      }

      return method(...args);
    } catch (error) {
      console.error("Error calling method by path:", error);
    }
  }

  /**
   * 向主进程发送消息,并等待主进程返回结果
   * 传入方法字符串路径,从window上进行调用
   */
  async sendSync(channel: string, data?: any) {
    try {
      const result = await this.chainCall(channel, this.formatData(data));
      if (typeof result == "object" && result.hasOwnProperty("type")) {
        if (this.elNotification) {
          this.elNotification.close();
          await nextTick();
        }
        this.elNotification = ElNotification({
          title: result.title,
          message: result.message,
          type: result.type,
          duration: result.duration,
          position: "bottom-right",
        });

        return Promise.reject(result);
      }
      return result;
    } catch (err) {
      if (this.elNotification) {
        this.elNotification.close();
        await nextTick();
      }
      this.elNotification = ElNotification({
        title: err.title,
        message: err.message,
        type: "error",
        duration: err.duration,
        position: "bottom-right",
      });
      console.error(err);
      return Promise.reject(err);
    }
  }
}

export default new IpcMainMess();
