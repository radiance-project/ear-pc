
//----------------------------------------------

// 0 = EAR 1, 1 = EAR STICKS, 2 = NOTHING CONNECTED
var connectedDevices = 2;

//----------------------------------------------

const path = require("path")
const { exec } = require('child_process');

const { app, Menu, Tray, BrowserWindow, screen, shell, ipcMain } = require("electron")
const { spawn } = require('child_process');

let tray = null
let trayWindow = null

let bigWindow = null
let backendProcess = null;
let isLaunched = false;

var bigWindowUrl = connectedDevices == 1 ? "http://localhost:17079/MainControl/MainControl_sticks.html" : connectedDevices == 0 ? "http://localhost:17079/MainControl/MainControl_one.html" : "http://localhost:17079/MainControl/MainControl_nothing_connected.html"
var trayUrl = connectedDevices == 1 ? "http://localhost:17079/tray/sticks.html" : connectedDevices == 0 ? "http://localhost:17079/tray/one.html" : "http://localhost:17079/tray/nothing_connected.html"

// var bigWindowUrl = "http://localhost:17079/MainControl/MainControl_two.html"
// trayUrl = "http://localhost:17079/tray/two.html"


ipcMain.on('load-url', (event, id, url) => {
    //console.log("load-url", id, url)
    if (id == 1) {
        bigWindow.loadURL(url);
    }
    else if (id == 2) {
        trayWindow.loadURL(url);
    }
});

//ipc for tray resize and position
ipcMain.on('tray-resize', (event, id, width, height) => {
    //console.log("tray-resize", id, width, height)
    if (id == 2) {
        trayWindow.setSize(width, height);
    }
});

ipcMain.on('tray-position', (event, id, x, y) => {
    //console.log("tray-position", id, x, y)
    if (id == 2) {
        trayWindow.setPosition(x, y);
    }
});

function loadURLWithRetry(window, url, shouldLaunch = false) {
    if (shouldLaunch) {
        window.loadURL(url);
        return;
    }
    const timeout = setTimeout(() => {
        //load url and get response code
        window.loadURL(url, (response) => {
            if (response && response.statusCode == 200) {
                isLaunched = true;
            } else {
                rebootProcess();
            }
        });
    }, 3000);
    window.webContents.on('did-fail-load', () => {
        clearTimeout(timeout);
        if (!isLaunched) {
            rebootProcess();
        } else {
            window.loadURL(url);
        }
    });
}

function rebootProcess() {
    backendProcess = spawn(path.join(__dirname, '/../../../ear-pc.exe'), [], {
        cwd: path.join(__dirname, '/../../../'),
        detached: true,
        stdio: 'ignore'
    });
    app.quit();
}

let isSingleInstance = app.requestSingleInstanceLock()
if (!isSingleInstance) {
    app.quit()
}

// Behaviour on second instance for parent process- Pretty much optional
app.on('second-instance', (event, argv, cwd) => {
    newMainWindow();
})

app.on('ready', async () => {
    bigWindow = new BrowserWindow({
        icon: __dirname + "./LOGO.png",
        width: 800,
        height: 710,
        frame: false,
        fullscreenable: false,
        resizable: false,
        transparent: true,
        roundedCorners: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: __dirname + '/preload.js'
        }
    })

    bigWindow.webContents.setWindowOpenHandler((edata) => {
        shell.openExternal(edata.url);
        return { action: "deny" };
    });

    tray = new Tray(__dirname + '/LOGO.png')
    trayWindow = new BrowserWindow({
        width: connectedDevices == 1 ? 300 : 650,
        height: 300,
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: false,
        transparent: true,
        alwaysOnTop: true,
        roundedCorners: true,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    loadURLWithRetry(trayWindow, trayUrl)

    const { width, height } = screen.getPrimaryDisplay().workAreaSize

    // Position the window in the right-bottom corner
    trayWindow.setPosition(width - trayWindow.getSize()[0], height - trayWindow.getSize()[1])


    const menu = Menu.buildFromTemplate([
        {
            label: 'Quit',
            click() { app.quit(); }
        },
        {
            label: 'Show main window',
            click() {
                newMainWindow();
            }
        }

    ]);
    tray.setToolTip("Nothing connected")
    tray.setContextMenu(menu)
    tray.on('click', () => {

        trayWindow.isVisible() ? trayWindow.hide() : trayWindow.show()
    })
    trayWindow.on('blur', () => {
        trayWindow.hide()
    });
    bigWindow.webContents.on('did-finish-load', () => {
        bigWindow.webContents.send('load-js', 'preload.js');
    });
    loadURLWithRetry(bigWindow, bigWindowUrl)
})

function newMainWindow() {
    if (bigWindow && !bigWindow.isDestroyed()) {
        // If the window already exists, bring it to the foreground
        bigWindow.show();
    } else {
        // If the window does not exist, create it
        bigWindow = new BrowserWindow({
            icon: __dirname + "./LOGO.png",
            width: 800,
            height: 710,
            frame: false,
            fullscreenable: false,
            resizable: false,
            transparent: true,
            roundedCorners: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                preload: __dirname + '/preload.js'
            }
        });

        bigWindow.webContents.setWindowOpenHandler((edata) => {
            shell.openExternal(edata.url);
            return { action: "deny" };
        });

        bigWindow.on('closed', () => {
            bigWindow = null;
        });

        loadURLWithRetry(bigWindow, bigWindowUrl, true)
    }
}

module.exports = {
    trayWindow,
    bigWindow
}

