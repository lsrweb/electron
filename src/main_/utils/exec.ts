import { toJson } from "@/render_/utils";
import { exec, execSync } from "child_process";
import consola from "consola";
import { error, info, log } from "console";
import { app, dialog } from "electron";
const iconv = require("iconv-lite");

export function executePowerShellScript(scriptPath: string, args: string[]): Promise<string> {
  return new Promise(async (resolve, reject) => {
    // 编码
    try {
      const command = `powershell.exe -File ${scriptPath} ${args.join(" ")}`;
      const childProcess = execSync(command, {});
      console.log(iconv.decode(childProcess.toString("binary"), "cp936"));

      resolve(iconv.decode(childProcess.toString("binary"), "cp936"));
    } catch (e) {
      // @ts-ignore
      app["ws"].send(
        toJson({
          type: "error",
          message: iconv.decode(e.output[1].toString("binary"), "cp936"),
        })
      );
      reject(e);
    }
  });
}

export function executeCommand(command: string, callback?: (data: string) => void): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const result = exec(command, { encoding: "binary" }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        if (callback) {
          callback(stdout);
        }
        resolve(stdout);
      }
    });

    result.stdout?.on("data", (data) => {
      resolve(data);
    });

    result.stderr?.on("data", (data) => {
      resolve(data);
    });

    result.on("close", (code) => {
      if (code !== 0) {
        reject(code);
      }
    });
  });
}
