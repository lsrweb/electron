import { app } from "electron";

export const isDev = () => {
  return !app.isPackaged && process.env.NODE_ENV === "development" && process.resourcesPath.includes("node_modules");
};

export const isWin = () => {
  return process.platform === "win32";
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
