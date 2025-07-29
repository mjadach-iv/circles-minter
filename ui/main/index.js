import { app, BrowserWindow, Menu, Tray, nativeImage } from 'electron';
import Store from 'electron-store';
import { fileURLToPath } from 'url';
import path from 'path';
import { menuTemplate } from './menuTemplate.js';
import { registerIpcHandlers } from './ipc.js';

const isDev = process.env.NODE_ENV === "development";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const store = new Store();
let trayIcon = nativeImage.createFromPath(path.join(app.getAppPath(), 'assets/circles-logo-64.png'));
if (process.platform === 'darwin') {
    trayIcon = nativeImage.createFromPath(path.join(app.getAppPath(), 'assets/circles-logo-22.png'));
    trayIcon.setTemplateImage(true);
}
let mainWindow = null;
let displayWindow = true;


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
            }
        },
    );

    if (process.platform === 'darwin') {
        const menu = Menu.buildFromTemplate(menuTemplate);
        Menu.setApplicationMenu(menu);
    } else {
        Menu.setApplicationMenu(null);
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

app.whenReady().then(() => {
    // Set autostart at launch based on stored preference
    const autostart = store.get('autostart');
    if (typeof autostart === 'boolean') {
        app.setLoginItemSettings({
            openAtLogin: autostart,
            path: app.getPath('exe'),
        });
    }
    createWindow();
    registerIpcHandlers();

    // Add tray icon with simple menu

    // function handleShow() {
    //     displayWindow = true;
    //     if (mainWindow) mainWindow.show();
    //     if (process.platform === 'darwin') app.dock.show();
    //     updateTrayMenu();
    // }
    // function handleHide() {
    //     displayWindow = false;
    //     if (mainWindow) mainWindow.hide();
    //     if (process.platform === 'darwin') app.dock.hide();
    //     updateTrayMenu();
    // }

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
    tray.on('double-click', handleShow);


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
});
