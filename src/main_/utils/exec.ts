// @ts-nocheck

import { toJson } from "@/render_/utils";
import { exec, execSync, spawn } from "child_process";
import { error } from "console";
import { app, dialog } from "electron";
const iconv = require("iconv-lite");

export function executePowerShellScript(scriptPath: string, args: string[]): Promise<string> {
  return new Promise(async (resolve, reject) => {
    // 编码
    try {
      const terminal = spawn(
        "powershell.exe",
        ["-NoLogo", "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", scriptPath, args.join(" ")],
        {
          shell: true,
          encoding: "binary",
        }
      );

      let result = "";

      terminal.stdout.on("data", (data) => {
        console.log(`stdout: ${data}`);
        result += iconv.decode(data, "cp936");
      });
      terminal.stderr.on("data", (data) => {
        // 判断是否是错误信息
      });

      terminal.on("close", (code) => {
        // console.log(`子进程退出，退出码 ${code}`);
        if (code === 0) {
          resolve(result);
        } else {
          console.log("error", "child process exited with code", code);

          // @ts-ignore
          app["ws"].send(
            toJson({
              type: "error",
              // @ts-ignore
              message: result,
            })
          );
          reject(new Error(`PowerShell 脚本执行失败，退出码 ${code}`));
        }
      });
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
