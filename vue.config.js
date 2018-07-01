const path = require('path');

module.exports = {
  pluginOptions: {
    electronBuilder: {
      outputDir: 'build',
      mainProcessFile: 'src/main/index.js',
      disableMainProcessTypescript: true,
      builderOptions: {
        productName: 'Google 翻译',
        appId: 'org.moefe.googletranslate',
        mac: {
          icon: 'build/bundled/icon.icns',
        },
      },
    },
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV !== 'production') {
      config.module
        .rule('tsx')
        .test(/\.tsx$/)
        .use('vue-jsx-hot-loader')
        .before('babel-loader')
        .loader('vue-jsx-hot-loader');
    }

    config.resolve.alias
      .set('assets', path.resolve(__dirname, 'src/assets'))
      .set('components', path.resolve(__dirname, 'src/components'))
      .set('plugins', path.resolve(__dirname, 'src/plugins'))
      .set('router', path.resolve(__dirname, 'src/router'))
      .set('stores', path.resolve(__dirname, 'src/store'))
      .set('utils', path.resolve(__dirname, 'src/utils'))
      .set('views', path.resolve(__dirname, 'src/views'));
  },
};
