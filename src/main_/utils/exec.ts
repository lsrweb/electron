import { toJson } from "@/render_/utils";
import { exec, execSync, spawn } from "child_process";
import { error } from "console";
import { app, dialog } from "electron";
const iconv = require("iconv-lite");

export function executePowerShellScript(scriptPath: string, args: string[]): Promise<string> {
  return new Promise(async (resolve, reject) => {
    // 编码
    try {
      // const command = `powershell.exe -NoLogo -NoProfile -File ${scriptPath} ${args.join(" ")}`;
      // const childProcess = execSync(command, {});
      // console.log(iconv.decode(childProcess.toString("binary"), "cp936"));
      // resolve(iconv.decode(childProcess.toString("binary"), "cp936"));
      // 获取终端命令行 cmd.exe
      // const command = `Start-Process -FilePath "powershell.exe" -ArgumentList "-ExecutionPolicy Bypass -NoLogo -NoProfile -NonInteractive -File ${scriptPath} ${args.join(
      //   " "
      // )}" -NoNewWindow -Wait -PassThru`;
      // const childProcess = execSync(command, { encoding: "binary" });
      // resolve(iconv.decode(childProcess.toString("binary"), "cp936"));
      // 获取终端命令行 cmd.exe
      // const execShell = execSync(
      //   "%SystemRoot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe -NoLogo -NoProfile -NonInteractive -ExecutionPolicy Bypass -File " +
      //     scriptPath +
      //     " " +
      //     args.join(" "),
      //   {
      //     encoding: "binary",
      //   }
      // );
      // resolve(iconv.decode(execShell.toString("binary"), "cp936"));
      // const command = `"powershell.exe" -NoLogo -NoProfile -NonInteractive -File ${scriptPath} ${args.join(" ")}"`;
      // const childProcess = execSync(command, { encoding: "binary" });
      // resolve(iconv.decode(childProcess.toString("binary"), "cp936"));
      // 以上方案都不行,尝试下面的方案,打开黑色外部终端

      // 使用 CMD 打开终端并执行命令
      // 根据操作系统选择适当的终端命令
      const terminal = spawn(
        "powershell.exe",
        ["-NoLogo", "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", scriptPath, args.join(" ")],
        {
          shell: true,
        }
      );

      let result = "";

      terminal.stdout.on("data", (data) => {
        result += data.toString();
      });

      terminal.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
        // @ts-ignore
        app["ws"].send(
          toJson({
            type: "error",
            message: iconv.decode(data.toString("binary"), "cp936"),
          })
        );
      });

      terminal.on("close", (code) => {
        // console.log(`子进程退出，退出码 ${code}`);
        error(`child process exited with code ${code},===========`);
        if (code === 0) {
          resolve(iconv.decode(result, "cp936"));
        } else {
          // @ts-ignore
          app["ws"].send(
            toJson({
              type: "error",
              // @ts-ignore
              message: iconv.decode(data.toString("binary"), "cp936"),
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
