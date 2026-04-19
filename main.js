const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    autoHideMenuBar: true
  });

  win.loadURL("https://studio.cattymod.app/");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
