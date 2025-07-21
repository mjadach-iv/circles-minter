import { app, BrowserWindow, ipcMain } from 'electron';
import Store from 'electron-store';
import { decryptJson, encryptJson } from './functions.js';

const isDev = process.env.NODE_ENV === "development";
let mainWindow = null;

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 400,
        height: 700,
        minWidth: 400, 
        minHeight: 500,
    });

    if (isDev) {
        // During development, load the React dev server
        mainWindow.loadURL("http://localhost:5173/"); // or your dev server port
    } else {
        // and load the index.html of the app.
        mainWindow.loadFile(path.join(__dirname, "../renderer/dist/index.html"));
    }

}

app.whenReady().then(() => {
  createWindow();
  registerIpcHandlers();
});

const store = new Store();
 function registerIpcHandlers() {
  ipcMain.handle('get-db', (event) => {
    const db = store.get('db');
    const json = db ? decryptJson(db) : null;
    return json;
  });

  ipcMain.handle('save-db', (event, value) => {
    const db = encryptJson(value);
    store.set('db', db);
    return true;
  });
}