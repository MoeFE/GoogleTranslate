var request = require('request')
var fs = require('fs')
var path = require('path').resolve(__dirname, './renderer/assets/img')
var langs = require('./renderer/assets/json/languages')
var api = 'https://ssl-api.itranslateapp.com/flags/{lang}-2x.png'

console.log(langs)

fs.mkdir(path, err => {
  if (err) console.log(err)
  Object.keys(langs).forEach(lang => {
    var filename = `${path}/${lang}-2x.png`
    var stream = fs.createWriteStream(filename)
    request(api.replace('{lang}', lang)).pipe(stream).on('close', () => {
      console.log(`${filename} 下载完成`)
    })
  })
})
