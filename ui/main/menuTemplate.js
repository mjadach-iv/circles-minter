import { app, BrowserWindow, Menu, Tray, nativeImage } from 'electron';

// Custom menu template
    export const menuTemplate = [
        {
            label: 'CRC Auto Minter', // Changed from 'File' to app name
            submenu: [
                {
                    label: 'Quit',
                    click: () => {
                        app.isQuiting = true;
                        app.quit();
                    }
                }
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

    const isDev = process.env.NODE_ENV === "development";
    if (isDev) {
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