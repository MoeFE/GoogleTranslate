var request = require('request')
var fs = require('fs')
var path = require('path').resolve(__dirname, './renderer/assets/img')
var langs = require('./renderer/assets/json/languages')
var api = 'http://api.itranslateapp.com/flags/{lang}-2x.png'

fs.mkdir(path, err => {
  if (err) {
    console.log(err)
    process.abort()
    return
  }
  var count = 0
  Object.keys(langs).forEach((lang, index, arr) => {
    var filename = `${path}/${lang}-2x.png`
    var stream = fs.createWriteStream(filename)
    request(api.replace('{lang}', lang)).pipe(stream).on('close', () => {
      console.log(`${filename} 下载完成`)
      if (++count >= arr.length) {
        console.log('所有任务下载完成')
        process.abort()
      }
    })
  })
})
