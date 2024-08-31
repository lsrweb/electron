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

  tray.on("click", () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
      mainWindow.setSkipTaskbar(false);
    } else {
      mainWindow.show();
      mainWindow.setSkipTaskbar(true);
    }
  });
};

export { createTray };
