// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getDb: () => ipcRenderer.invoke('get-db'),
  saveDb: (value) => ipcRenderer.invoke('save-db', value),
  getUiSecret: () => ipcRenderer.invoke('get-ui-secret'),
  // add more methods as needed
});