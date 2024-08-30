import { exec } from "child_process";

export function executeCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const childProcess = exec(command);

    let output = "";

    childProcess.stdout.on("data", (data) => {
      // 处理命令输出
      output += data;
      // 将输出用于页面展示
      // TODO: 在页面上展示 output
    });

    childProcess.stderr.on("data", (data) => {
      // 处理错误输出
      // TODO: 在页面上展示错误信息
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

export function executePowerShellScript(
  scriptPath: string,
  args: string[]
): Promise<string> {
  return new Promise((resolve, reject) => {
    const command = `powershell.exe -File ${scriptPath} ${args.join(" ")}`;
    const childProcess = exec(command);

    let output = "";

    childProcess.stdout.on("data", (data) => {
      output += data;
    });

    childProcess.stderr.on("data", (data) => {
      reject(new Error(data));
    });

    childProcess.on("close", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Script execution failed with code ${code}`));
      }
    });
  });
}
