import { Tray, Menu, app, BrowserWindow } from "electron";
import path from "path";

let tray: Tray | null = null;

const createTray = (mainWindow: BrowserWindow) => {
  const iconPath = path.join(__dirname, "../../images/icon.png");
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "显示",
      click: () => {
        mainWindow.show();
      },
    },
    {
      label: "退出",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip("My Electron App");
  tray.setContextMenu(contextMenu);
};

export { createTray };
