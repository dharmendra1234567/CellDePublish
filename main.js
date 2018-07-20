const {app, BrowserWindow, Menu, protocol, ipcMain} = require('electron');
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

if (handleSquirrelEvent(app)) {
  return;
}

function handleSquirrelEvent(application) {
  if (process.argv.length === 1) {
      return false;
  }
  const ChildProcess = require('child_process');
  const path = require('path');
  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);
  const spawn = function(command, args) {
      let spawnedProcess, error;
      try {
          spawnedProcess = ChildProcess.spawn(command, args, {
              detached: true
          });
      } catch (error) {}
      return spawnedProcess;
  };
  const spawnUpdate = function(args) {
      return spawn(updateDotExe, args);
  };
  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
      case '--squirrel-install':
      case '--squirrel-updated':
          spawnUpdate(['--createShortcut', exeName]);
          setTimeout(application.quit, 1000);
          return true;
      case '--squirrel-uninstall':
          spawnUpdate(['--removeShortcut', exeName]);
          setTimeout(application.quit, 1000);
          return true;
      case '--squirrel-obsolete':
          application.quit();
          return true;
  }
};
require('./server');
let mainWindow
function createWindow () {
  mainWindow = new BrowserWindow({width: 1400, height: 800})
  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools();
  autoUpdater.checkForUpdatesAndNotify();
  mainWindow.on('closed', function () {
    mainWindow = null
  })
 
}

app.on('ready',function(){
  createWindow();
})
app.on('browser-window-created',function(e,window) {
  //window.setMenu(null);
  })
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

autoUpdater.on('checking-for-update', () => {
 // sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  //sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  //sendStatusToWindow('Update not available.');
})

function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('message', text);
}
autoUpdater.on('error', (err) => {
  //sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  // let log_message = "Download speed: " + progressObj.bytesPerSecond;
  // log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  // log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(progressObj.percent);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('108');
});

app.on('activate', function () {
  if (mainWindow === null) {
   createWindow()
    
  }

})