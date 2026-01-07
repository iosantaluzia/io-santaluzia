const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
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
  } else {
    // Em produção, o dist está dentro de resources/app.asar
    // O __dirname aponta para resources/app.asar ou resources/app.asar.unpacked/electron
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('=== PRODUCTION MODE ===');
    console.log('__dirname:', __dirname);
    console.log('Loading file from:', indexPath);
    console.log('File exists:', fs.existsSync(indexPath));
    
    // Verificar caminhos alternativos
    const altPaths = [
      path.join(__dirname, '../dist/index.html'),
      path.join(process.resourcesPath, 'app.asar/dist/index.html'),
      path.join(process.resourcesPath, 'app/dist/index.html'),
      path.join(app.getAppPath(), 'dist/index.html')
    ];
    
    console.log('Alternative paths:');
    altPaths.forEach((altPath, i) => {
      console.log(`  ${i + 1}. ${altPath} - exists: ${fs.existsSync(altPath)}`);
    });
    
    // Tentar carregar com loadFile primeiro (mais confiável)
    win.loadFile(indexPath).then(() => {
      console.log('File loaded successfully');
      // Após carregar, navegar para a rota correta
      setTimeout(() => {
        win.webContents.executeJavaScript(`window.location.hash = '#/adminio'`);
      }, 500);
    }).catch((error) => {
      console.error('Error loading file:', error);
      // Tentar caminhos alternativos
      for (const altPath of altPaths) {
        if (fs.existsSync(altPath)) {
          console.log(`Trying alternative path: ${altPath}`);
          win.loadFile(altPath).then(() => {
            setTimeout(() => {
              win.webContents.executeJavaScript(`window.location.hash = '#/adminio'`);
            }, 500);
          }).catch((err) => {
            console.error(`Error loading ${altPath}:`, err);
          });
          break;
        }
      }
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
