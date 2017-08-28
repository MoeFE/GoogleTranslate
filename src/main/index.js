'use strict'

import { app } from 'electron'
import path from 'path'
import MenubarWindow from './menubar'

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
    icon: path.join(__static, 'icon.ico'),
    index: winURL,
    height: 180,
    width: 400,
    resizable: false,
    scrollBounce: true,
    transparent: true,
    alwaysOnTop: true
  })

  // npm v5.3.0 builded is blank
  // mainWindow.webContents.openDevTools()
  // mainWindow.loadURL(winURL)

  mainWindow.on('after-create-window', () => {
    const window = mainWindow.window
    window.on('closed', () => (mainWindow = null))
    window.on('resize', () => {
      setTimeout(() => window.hide(), 30)
      setTimeout(() => window.show(), 30)
    })
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
