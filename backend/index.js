const APP_PORT = 8000;
const IS_DEBUG = true;
// const ROOT_PATH = __dirname;
const ROOT_PATH = require('electron-root-path').rootPath;

var _express_server = require("./src/express_server.js");
var _websocket_server = require("./src/websocket_server.js");

let expServer, expPort, wsServer, wsPort;

async function initBackServers() {
    expServer = new _express_server.ExpressServer();
    await expServer.init(APP_PORT, IS_DEBUG, ROOT_PATH);
    expPort = expServer.getPort();
    wsServer = new _websocket_server.WsServer();
    await wsServer.init(APP_PORT, IS_DEBUG);
    wsPort = wsServer.getPort();
    expServer.app.get('/wsport', (req,res) => {
      res.json({
          port: wsServer.getPort(),
      });
    })

    mainWindow.webContents.send('onload', {
      expPort: expPort,
      wsPort: wsPort
    });

    // const configs = {
    //   'expPort': expPort,
    //   'wsPort': wsPort
    // }

    // const filename = '.scomconfig';
    // const fs = require('fs');
    // fs.writeFileSync(filename, JSON.stringify(configs), 'utf8', function(err){
    //   console.log(err);
    // });
}

// // Electron Create
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024, 
    height: 786,
    minWidth: 780,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(ROOT_PATH, 'index.html'),
    // pathname:"./index.html",
    protocol: 'file:',
    slashes: true
  })).then(()=>{
    initBackServers(mainWindow);
  });

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  // mainWindow.webContents.send('onload', expPort);
}

const template = []; 
const menu = electron.Menu.buildFromTemplate(template); 
electron.Menu.setApplicationMenu(menu);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
    expServer.close();
    wsServer.close();
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.