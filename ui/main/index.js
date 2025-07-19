import { app, BrowserWindow } from 'electron';

const isDev = process.env.NODE_ENV === "development";
let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 350,
        height: 600,
    });

    if (isDev) {
        // During development, load the React dev server
        mainWindow.loadURL("http://localhost:5173/"); // or your dev server port
    } else {
        // and load the index.html of the app.
        mainWindow.loadFile(path.join(__dirname, "../renderer/dist/index.html"));
    }

}

app.whenReady().then(createWindow);