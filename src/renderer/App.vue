<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { remote } from 'electron'
const Window = remote.getCurrentWindow()
export default {
  name: 'translation',
  created () {
    window.addEventListener('resize', () => {
      Window.setSize(window.innerWidth, window.innerHeight)
    })
  }
}
</script>

<style lang="stylus">
@import './assets/fonts/index.styl'
html, body, #app
  height 100%
html
  -webkit-font-smoothing antialiased
  user-select none
  font-family -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Ubuntu, Helvetica Neue, sans-serif
  font-weight 300
body
  margin 0
  overflow hidden
</style>
