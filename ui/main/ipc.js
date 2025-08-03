import { app, ipcMain, dialog } from 'electron';
import Store from 'electron-store';
import { decryptJson, encryptJson, generateSecret } from './functions.js';
import { addToLaunchAgents, removeFromLaunchAgents, isInLaunchAgents } from './addToLaunchAgents.js';
import { mintNow } from './circles/index.js';
import { powerMonitor } from 'electron';

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

        if (process.platform === 'darwin') {
            if (value) {
                addToLaunchAgents(); // Ensure LaunchAgent is set up
            } else {
                removeFromLaunchAgents(); // Remove existing LaunchAgent if any
            }
            const check = isInLaunchAgents();
            return check;
        }

        // removeFromLaunchAgents(); // Remove existing LaunchAgent if any


        //         const check2 = isInLaunchAgents();
        // if (check2) {
        //     console.log('LaunchAgent is already set up');
        // } else {
        //     console.log('LaunchAgent is NOT already set up');
        // }
        // try {
        //     let loginItemSettings = { 
        //         openAtLogin: value 
        //     };
        //     if (process.platform !== 'darwin') {
        //         loginItemSettings.path = app.getPath('exe');
        //     }
        //     app.setLoginItemSettings(loginItemSettings);
        //     const settings = app.getLoginItemSettings();
        //     console.log('Getting autostart (OS):', settings.openAtLogin);
        //     store.set('autostart', settings.openAtLogin);
        //     return !!settings.openAtLogin;
        // } catch (error) {
        //     return false;
        // }
    });

    ipcMain.handle('get-autostart', () => {
        if (process.platform === 'darwin') {
            const check = isInLaunchAgents();
            return check;
        }

        const settings = app.getLoginItemSettings();
        console.log('Getting autostart (OS):', settings.openAtLogin);
        return !!settings.openAtLogin;
    });

    ipcMain.handle('auto-minting', (event, value) => {
        const next = Date.now() + 24 * 60 * 60 * 1000; // Set to 24 hours in the future
        console.log('Setting auto-minting:', value);
        store.set('auto-minting', { value, next });
        return { value, next };
    });

    ipcMain.handle('get-auto-minting', (event) => {        
        return store.get('auto-minting');
    });

    ipcMain.handle('mint-now', async (event) => {
        console.log('Minting now:');
        const rez = await mintNow();
        return rez;
    });

}
