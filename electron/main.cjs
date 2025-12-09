const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.cjs'),
      webSecurity: true
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
    titleBarStyle: 'default',
    autoHideMenuBar: true,
    show: false
  });

  // Tratamento de erros na janela
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  // Carregar aplicação
  if (isDev) {
    win.loadURL('http://localhost:8080/#/adminio');
    // DevTools pode ser aberto manualmente com Ctrl+Shift+I se necessário
    // win.webContents.openDevTools(); // Removido - não abre automaticamente
  } else {
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('Loading file from:', indexPath);
    // Usar loadURL com file:// para garantir que funciona
    const fileUrl = `file://${indexPath.replace(/\\/g, '/')}#/adminio`;
    console.log('Loading URL:', fileUrl);
    win.loadURL(fileUrl).catch((error) => {
      console.error('Error loading URL:', error);
      // Fallback: tentar loadFile sem hash
      win.loadFile(indexPath).catch((err) => {
        console.error('Error loading file:', err);
      });
    });
  }

  // Mostrar janela quando pronta
  win.once('ready-to-show', () => {
    win.show();
  });

  // Prevenir navegação para outras rotas não administrativas
  win.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    // Permitir apenas rotas administrativas
    if (!parsedUrl.pathname.includes('/adminio') && 
        !parsedUrl.pathname.includes('/admin') &&
        !parsedUrl.pathname.includes('/admin-dashboard') &&
        parsedUrl.protocol !== 'file:') {
      event.preventDefault();
    }
  });

  // Prevenir abertura de novas janelas
  win.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Prevenir navegação para URLs externas
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
});

