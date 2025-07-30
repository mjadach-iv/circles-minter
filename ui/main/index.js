import { app, BrowserWindow, Menu, Tray, nativeImage } from 'electron';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(app.getAppPath(), '.env') });
import Store from 'electron-store';
import { fileURLToPath } from 'url';
import path from 'path';
import { menuTemplate } from './menuTemplate.js';
import { registerIpcHandlers } from './ipc.js';


const isDev = process.env.NODE_ENV === "development";
const LAUNCHED_BY_LAUNCHAGENT = process.env.LAUNCHED_BY_LAUNCHAGENT === "1";
const AUTOLUNCHED = LAUNCHED_BY_LAUNCHAGENT || app.getLoginItemSettings().wasOpenedAtLogin;
console.log('AUTOLUNCHED:', AUTOLUNCHED);
console.log('env:', process.env.ENCRYPT_SECRET);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const store = new Store();
let trayIcon = nativeImage.createFromPath(path.join(app.getAppPath(), 'assets/circles-logo-64.png'));
if (process.platform === 'darwin') {
    trayIcon = nativeImage.createFromPath(path.join(app.getAppPath(), 'assets/circles-logo-22.png'));
    trayIcon.setTemplateImage(true);
}
app.setAppUserModelId('com.mjadachiv.crcautominter');
const firstStart = store.get('first-start');
if (firstStart === undefined && !isDev) {
    store.set('first-start', true);
    console.log('First start detected, setting first-start flag to true');
}
let mainWindow = null;
let displayWindow = isDev || !firstStart;


function createWindow() {
    mainWindow = new BrowserWindow(
        {
            width: 400,
            height: 660,
            minWidth: 400,
            minHeight: 500,
            icon: path.join(app.getAppPath(), '../assets/icon.png'),
            webPreferences: {
                preload: path.join(app.getAppPath(), 'main/preload.js'),
                contextIsolation: true,
                nodeIntegration: false,
            },
            show: displayWindow,
            title: 'CRC Auto Minter',
        },
    );

    if (process.platform === 'darwin') {
        const menu = Menu.buildFromTemplate(menuTemplate);
        Menu.setApplicationMenu(menu);
    } else {
        Menu.setApplicationMenu(null);
    }

    if (!displayWindow) {
        mainWindow.hide();
        if (process.platform === 'darwin') app.dock.hide();
    } else {
        mainWindow.show();
        if (process.platform === 'darwin') app.dock.show();
    }

    // Disable zooming (Ctrl/Cmd +/-, Ctrl/Cmd + Mousewheel, pinch)
    mainWindow.webContents.on('before-input-event', (event, input) => {
        if ((input.control || input.meta) && (input.key === '+' || input.key === '-' || input.key === '=')) {
            event.preventDefault();
        }
    });
    mainWindow.webContents.setZoomFactor(1);

    if (isDev) {
        // During development, load the React dev server
        mainWindow.loadURL("http://localhost:5173/"); // or your dev server port
        //  mainWindow.loadFile(path.join(__dirname, "../renderer/dist/index.html"));
        // Open DevTools automatically in development
        mainWindow.webContents.openDevTools();
    } else {
        // and load the index.html of the app.
        mainWindow.loadFile(path.join(__dirname, "../renderer/dist/index.html"));
        //   mainWindow.webContents.openDevTools();
    }
}

// Print all signals supported by the current Node.js runtime
const osSignals = process.binding('constants').os.signals;
Object.keys(osSignals).forEach(sig => {
    try {
        process.on(sig, () => {
            console.log(`Received signal: ${sig}`);
        });
    } catch (e) {
        // Some signals can't be caught, ignore errors
    }
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM: likely system logout/shutdown/restart');
    app.isQuiting = true;
});



app.whenReady().then(() => {
    // Set autostart at launch based on stored preference
    const autostart = store.get('autostart');
    if (typeof autostart === 'boolean') {
        // Set login item for autostart, cross-platform
        let loginItemSettings = { openAtLogin: autostart };
        if (process.platform !== 'darwin') {
            loginItemSettings.path = app.getPath('exe');
        }
        app.setLoginItemSettings(loginItemSettings);
    }
    
    createWindow();

    registerIpcHandlers();

    // Prevent default close button behavior: hide window instead of quitting
    mainWindow.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault();
            displayWindow = false;
            mainWindow.hide();
            if (process.platform === 'darwin') app.dock.hide();
            updateTrayMenu();
        }
    });

    // ** Tray handling ** //
    let tray = new Tray(trayIcon);
    function updateTrayMenu() {
        console.log('Updating tray menu, displayWindow:', displayWindow);
        const trayMenu = Menu.buildFromTemplate([
            !displayWindow ? {
                label: 'Show',
                click: () => {
                    if (!mainWindow) return;
                    displayWindow = true;
                    app.displayWindow = true;
                    mainWindow.show();
                    if (process.platform === 'darwin') app.dock.show();
                    updateTrayMenu();
                }
            } : {
                label: 'Hide',
                click: () => {
                    if (!mainWindow) return;
                    displayWindow = false;
                    app.displayWindow = false;
                    mainWindow.hide();
                    if (process.platform === 'darwin') app.dock.hide();
                    updateTrayMenu();
                }
            },
            {
                label: 'Quit',
                click: () => {
                    app.isQuiting = true;
                    app.quit();
                }
            }
        ]);
        tray.setContextMenu(trayMenu);
    }
    updateTrayMenu();
    tray.setToolTip('CRC Auto Minter');
    //  tray.on('double-click', handleShow);

    // ** Mac OS Dock handling ** //
    if (process.platform === 'darwin') {
        // Handle click on the dock icon in macOS
        app.on('activate', () => {
            if (mainWindow) {
                mainWindow.show();
                app.dock.show();
                displayWindow = true;
                updateTrayMenu();
            }
        });
    }

});

