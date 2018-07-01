module.exports = {
  presets: ['@vue/app'],
  plugins: ['jsx-v-model'],
  env: {
    production: {
      plugins: [['emotion', { hoist: true }]],
    },
    development: {
      plugins: [['emotion', { sourceMap: true, autoLabel: true }]],
    },
  },
};
