import fs from 'fs'
import os from 'os'
import path from 'path'
import uuid from 'uuid'
import events from 'events'
import request from 'request'
import progress from 'request-progress'
import process from 'child_process'
import { app } from 'electron'
import { version, updater, build } from '../../package.json'
const tmpdir = os.tmpdir()
const guid = uuid()

function checkForUpdates (win, winURL) {
  if (!win) return
  if (!updater.url) return
  win.updater = new events.EventEmitter()
  const opt = {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Electron/1.7.5 Safari/537.36'
    }
  }
  request(updater.url, opt, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const meta = JSON.parse(body)
      const zip = meta.assets.find(x => x.name === `${build.productName}-${meta.name}-mac.zip`)
      if (!zip) return
      if (version > meta.name) return

      const savedir = path.resolve(tmpdir, `update-${guid}.zip`)
      win.updater.meta = meta
      win.updater.version = version
      win.updater.downloadUpdate = () => {
        progress(request(zip.browser_download_url))
          .on('progress', state => win.updater.emit('update-progress', state))
          .on('error', err => win.updater.emit('update-error', err))
          .pipe(fs.createWriteStream(savedir))
          .on('close', () => win.updater.emit('update-downloaded'))
      }

      win.updater.quitAndInstall = quit => {
        process.exec(`unzip -o ${savedir} -d /Applications`, (error, stdout) => {
          if (error) {
            console.log(error)
            return
          }
          const appName = stdout.match(/(\w+\.app)/)[0]
          process.exec(`open /Applications/${appName}`)
          fs.unlinkSync(savedir)
          quit && app.quit()
        })
      }
      win.loadURL(winURL + '#/update')
      win.show()
    } else console.log(response.statusCode, error)
  })
}

export { checkForUpdates }
export default checkForUpdates
