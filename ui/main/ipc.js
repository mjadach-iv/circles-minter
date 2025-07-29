import { app, ipcMain } from 'electron';
import Store from 'electron-store';
import { decryptJson, encryptJson, generateSecret } from './functions.js';

const store = new Store();
export function registerIpcHandlers() {
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
    ipcMain.handle('set-autostart', (event, value) => {
        console.log('Setting autostart:', value);
        try {
            app.setLoginItemSettings({
                openAtLogin: value,
                path: app.getPath('exe'),
            });
            const settings = app.getLoginItemSettings();
            console.log('Getting autostart (OS):', settings.openAtLogin);
            store.set('autostart', settings.openAtLogin);
            return !!settings.openAtLogin;
        } catch (error) {
            console.error('Error setting autostart:', error);
            return false;
        }
    });
    ipcMain.handle('get-autostart', () => {
        const settings = app.getLoginItemSettings();
        console.log('Getting autostart (OS):', settings.openAtLogin);
        return !!settings.openAtLogin;
    });
}
