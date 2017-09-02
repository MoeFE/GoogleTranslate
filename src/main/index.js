'use strict'

import { app } from 'electron'
import path from 'path'
import MenubarWindow from './menubar'
import setReferer from 'electron-referer'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new MenubarWindow({
    title: 'Google Translate',
    icon: path.join(__static, 'icon.ico'),
    index: winURL,
    height: 190,
    width: 420,
    hasShadow: false,
    resizable: false,
    scrollBounce: true,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      webSecurity: false,
      allowRunningInsecureContent: true
    }
  })

  // npm v5.3.0 builded is blank
  // mainWindow.webContents.openDevTools()
  // mainWindow.loadURL(winURL)

  mainWindow.on('after-create-window', () => {
    const window = mainWindow.window
    window.setReferer = (ref) => setReferer(ref, window)
    window.setReferer('https://www.google.com')
    window.on('closed', () => (mainWindow = null))
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
