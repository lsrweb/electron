import { exec } from "child_process";
import consola from "consola";
import { error, info, log } from "console";

export function executeCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const childProcess = exec(command, {});

    let output = "";

    childProcess.stdout.on("data", (data) => {
      // 处理命令输出
      output += data;
      // 将输出用于页面展示
      // TODO: 在页面上展示 output
      consola.error(data.toString());
    });

    childProcess.stderr.on("data", (data) => {
      // 处理错误输出
      // TODO: 在页面上展示错误信息
      // 将buffer转为string
      console.log(data.toString());
    });

    childProcess.on("close", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Command execution failed with code ${code}`));
      }
    });
  });
}

export function executePowerShellScript(scriptPath: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const command = `powershell.exe -File ${scriptPath} ${args.join(" ")}`;
    const childProcess = exec(command, {}, (err, stdout, stderr) => {
      if (err) {
        error(err);
        reject(err);
      } else {
        resolve(stdout);
      }
    });

    let output = "";
  });
}
