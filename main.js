'use strict';
require('v8-compile-cache');
require('electron-reload')(__dirname);

// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, Tray } = require('electron')

const Store = require('electron-store');
const store = new Store();
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
    //
    const nativeImage = require('electron').nativeImage;
    var image = nativeImage.createFromPath(path.join(__dirname, 'resources', 'icon.ico'));

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 550,
        height: 550,
        backgroundColor: '#ffffff',
        transparent: false,
        icon: image,
        maximizable: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html')
    mainWindow.setMenu(null)

    // Open the DevTools.
    // mainWindow.webContents.openDevTools({ mode: 'detach' })

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    store.set('isStarted', false)

    var appIcon = new Tray(image)

    var contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show', click: function () {
                mainWindow.show()
            }
        },
        {
            label: 'Quit', click: function () {
                app.isQuiting = true
                app.quit()
            }
        }
    ])

    appIcon.setContextMenu(contextMenu)
    appIcon.on('click', function () {
        mainWindow.show()
    })

    mainWindow.on('close', function (event) {
        mainWindow = null
    })

    mainWindow.on('minimize', function (event) {
        if (store.get('isStarted')) {
            event.preventDefault()
            mainWindow.hide()
        }
    })

    mainWindow.on('show', function () {
        appIcon.setHighlightMode('always')
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.