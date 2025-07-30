// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getDb: () => ipcRenderer.invoke('get-db'),
  saveDb: (value) => ipcRenderer.invoke('save-db', value),
  getUiSecret: () => ipcRenderer.invoke('get-ui-secret'),
  setAutostart: (value) => ipcRenderer.invoke('set-autostart', value),
  getAutostart: () => ipcRenderer.invoke('get-autostart'),
  mintNow: () => ipcRenderer.invoke('mint-now'),
  setAutoMinting: (value) => ipcRenderer.invoke('set-auto-minting', value),
  getAutoMinting: () => ipcRenderer.invoke('get-auto-minting'),
});