const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

const path = require('path');
const url = require('url');
const fs = require('fs');

const liveServer = require('live-server');

let mainWindow;
let liveWindow;

function createWindow() {
  mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
  }));

  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  liveServer.start({
    port: 8080, // Set the server port. Defaults to 8080.
    host: '0.0.0.0', // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    root: './current', // Set root directory that's being served. Defaults to cwd.
    open: false, // When false, it won't load your browser by default.
    file: 'index.html', // When set, serve this file for every 404 (useful for single-page applications)
    wait: 500, // Waits for all changes, before reloading. Defaults to 0 sec.
    logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
    middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
  });

  liveWindow = new BrowserWindow({width: 800, height: 600});
  liveWindow.loadURL('http://localhost:8080/index.html');
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});

ipc.on('reload', function(event, arg) {
  fs.writeFile('./current/html.html', arg[0], function(err) {});
  fs.writeFile('./current/style.css', arg[1], function(err) {});
  fs.writeFile('./current/javascript.js', arg[2], function(err) {});
});
