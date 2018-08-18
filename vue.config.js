/* eslint-disable global-require */
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

    config
      .entry('app')
      .clear()
      .add('./src/renderer/main.ts');

    config.plugin('define').tap((args) => {
      Object.assign(args[0], {
        VERSION: JSON.stringify(require('./package.json').version),
      });
      return args;
    });

    config.resolve.alias
      .set('emotion', path.resolve(__dirname, 'src/renderer/lib/emotion.js'))
      .set('assets', path.resolve(__dirname, 'src/renderer/assets'))
      .set('components', path.resolve(__dirname, 'src/renderer/components'))
      .set('utils', path.resolve(__dirname, 'src/renderer/utils'))
      .set('views', path.resolve(__dirname, 'src/renderer/views'));
  },
};
