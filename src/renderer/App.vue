<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  export default {
    name: 'translation'
  }
</script>

<style lang="stylus">
@import './assets/fonts/index.styl'
html
  -webkit-font-smoothing antialiased
  user-select none
  font-family -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Ubuntu, Helvetica Neue, sans-serif
  font-weight 300
body
  margin 0
  overflow hidden
</style>
