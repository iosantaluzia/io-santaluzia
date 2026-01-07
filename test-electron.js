// Script de teste para verificar se o Electron funciona
const { app, BrowserWindow } = require('electron');
const path = require('path');

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  win.webContents.openDevTools();
  
  console.log('Electron test window opened');
});

