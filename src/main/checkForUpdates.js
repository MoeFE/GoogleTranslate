import { shell, Notification } from 'electron';
import download from 'download';
import pkg from '../../package.json';

export default async function checkForUpdates() {
  const release = await download(
    'https://api.github.com/repos/MoeFE/GoogleTranslate/releases/latest',
  ).then(res => JSON.parse(res.toString()));
  const [version] = release.name.match(/[\d|.]+/);
  if (version > pkg.version) {
    const notice = new Notification({
      title: 'Google 翻译',
      body: `发现新版本 (${release.name}) 可用，点击下载最新版本！`,
    });
    notice.on('click', () =>
      shell.openExternal(
        'https://github.com/MoeFE/GoogleTranslate/releases/latest',
      ),
    );
    notice.show();
  }
}
