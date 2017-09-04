import log from 'electron-log'
import updater from 'electron-simple-updater'
import pkg from '../../package.json'

function checkForUpdates (win) {
  updater.init({
    url: pkg.updater.url,
    version: pkg.version,
    checkUpdateOnStart: false,
    autoDownload: false,
    logger: log
  })

  updater.on('update-available', (meta) => {
    log.info('[updater] update avaiable: ', meta.version)
    win.updater = updater
    win.updater.meta = meta
    win.show()
  })

  updater.on('update-not-available', () => log.warn('[updater] update not available.'))

  updater.on('update-downloaded', (meta) => log.info('[updater] update downloaded: ', meta.version))

  updater.on('error', (err) => log.error('[updater] update error: ', err))

  updater.checkForUpdates()
}

export { checkForUpdates }
export default checkForUpdates
