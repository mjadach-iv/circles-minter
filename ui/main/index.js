import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import Store from 'electron-store';
import { decryptJson, encryptJson, generateSecret, decryptString } from './functions.js';
import { fileURLToPath } from 'url';
import path from 'path';

const isDev = process.env.NODE_ENV === "development";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let mainWindow = null;

function createWindow() {

    mainWindow = new BrowserWindow(
        {
            width: 400,
            height: 700,
            minWidth: 400,
            minHeight: 500,
            icon: path.join(__dirname, 'icon.png'),
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: true,
                nodeIntegration: false,
            }
        },
    );

    // Custom menu template
    const menuTemplate = [
        {
            label: 'CRC Auto Minter', // Changed from 'File' to app name
            submenu: [
                { role: 'quit' }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'paste' },
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Report an issue',
                    click: async () => {
                        const { shell } = require('electron');
                        await shell.openExternal('https://github.com/mjadach-iv/crc-auto-minter/issues');
                    }
                },
                {
                    label: 'See the Github repo',
                    click: async () => {
                        const { shell } = require('electron');
                        await shell.openExternal('https://github.com/mjadach-iv/crc-auto-minter');
                    }
                }
            ]
        },
    ];
    if(isDev) {
        menuTemplate.push({
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forcereload' },
                { type: 'separator' },
                { role: 'toggledevtools' }
            ]
        })
    }

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

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
    createWindow();
    registerIpcHandlers();
});

const store = new Store();
function registerIpcHandlers() {
    ipcMain.handle('get-db', async (event) => {
        try {
            const db = store.get('db');
            const json = db ? decryptJson(db) : null;
            return json;
        } catch (error) {
            console.error('Error getting DB:', error);
            return null;
        }
    });

    ipcMain.handle('save-db', (event, value) => {
        console.log('Saving DB:', value);
        const db = encryptJson(value);
        store.set('db', db);
        return true;
    });

    ipcMain.handle('get-ui-secret', (event) => {
        const secret = store.get('uiSecret');
        if (!secret) {
            const randomString = generateSecret(); // 32 hex chars
            console.log(randomString);
            store.set('uiSecret', randomString);
            return randomString; // Return the newly generated secret
        }
        console.log(secret);
        return secret;
    });
}
