import { app, protocol } from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { format as formatUrl } from 'url';
import path from 'path';
import createProtocol from 'vue-cli-plugin-electron-builder/lib/createProtocol';
import menubar from './menubar';

const isDevelopment = process.env.NODE_ENV !== 'production';

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true });

function createMainWindow() {
  // https://electronjs.org/docs/api/browser-window
  const mb = menubar({
    title: 'Google Translate',
    icon: path.join(__static, 'iconTemplate.ico'), // https://electronjs.org/docs/api/native-image
    index: isDevelopment
      ? process.env.WEBPACK_DEV_SERVER_URL
      : formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
      }),
    height: 190,
    width: 420,
    hasShadow: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    scrollBounce: true,
    showDockIcon: isDevelopment,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      webSecurity: false,
      allowRunningInsecureContent: true,
    },
  });

  mb.on('show', () => {
    mb.tray.setHighlightMode('selection');
  });

  mb.on('after-create-window', () => {
    const { window } = mb;
    if (isDevelopment) {
      window.webContents.openDevTools({ mode: 'undocked' });
    } else createProtocol('app');

    window.on('closed', () => {
      mainWindow = null;
    });

    window.webContents.on('devtools-opened', () => {
      window.focus();
      setImmediate(() => {
        window.focus();
      });
    });
  });

  return mb;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  // https://electronjs.org/docs/tutorial/devtools-extension
  installExtension(VUEJS_DEVTOOLS).catch((err) => {
    console.log('Unable to install `vue-devtools`: \n', err);
  });
  mainWindow = createMainWindow();
});
