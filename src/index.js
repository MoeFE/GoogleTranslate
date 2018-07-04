const path = require('path');
const download = require('download');
const { languages } = require('./renderer/assets/languages.json');

Promise.all(
  languages
    .map(x => x.dialects.map(v => v.flag_image_2x))
    .toString()
    .split(',')
    .map(url => download(url, 'src/renderer/assets/img')),
).then(() => {
  console.log('files downloaded!');
});
