<template>
  <div :id="id">
    <keep-alive include="transition-page">
      <router-view class="menubarWindow"></router-view>
    </keep-alive>
    <router-view ref="normalWindow" class="normalWindow" name="normalWindow"></router-view>
  </div>
</template>
<script>
import { remote, webFrame } from 'electron'
const { globalShortcut } = remote.require('electron')
const Window = remote.getCurrentWindow()
export default {
  name: 'translation',
  data () {
    return {
      id: 'app'
    }
  },
  mounted () {
    this.id = this.$refs.normalWindow ? 'window' : 'app'
    webFrame.setZoomFactor(1)
    webFrame.setZoomLevelLimits(1, 1)
    webFrame.setVisualZoomLevelLimits(1, 1)
    webFrame.setLayoutZoomLevelLimits(0, 0)
    this.$watch(() => this.$store.getters.state.hotkey, this.registerShortcut)
    this.registerShortcut()
  },
  methods: {
    registerShortcut () {
      globalShortcut.unregisterAll()
      const hotkey = this.$store.getters.state.hotkey
      if (hotkey) globalShortcut.register(hotkey, () => Window.isVisible() ? Window.hide() : Window.show())
    }
  }
}
</script>
<style lang="stylus">
@import './assets/fonts/index.styl'
*
  backface-visibility: hidden
html, body, #app
  height 100%
html
  -webkit-font-smoothing antialiased
  user-select none
  font-family -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Ubuntu, Helvetica Neue, sans-serif
  font-weight 300
  cursor default
body
  margin 0
  overflow hidden
#app 
  &::before
    content '\e601'
    display block
    color #4286f5
    font-family icon
    font-size 32px
    text-align center
    line-height .3
    transform rotate(180deg)
  > .menubarWindow
    display flex
    flex-direction column
    margin auto
    width calc(100% - 20px)
    height calc(100% - 19px)
    border-radius 6px
    box-shadow 0 0 10px rgba(0, 0, 0, .3)
    overflow hidden
    > main
      flex 1
      display flex
      align-items center
      position relative
      background #fff
      box-sizing border-box
      border-radius 0 0 6px 6px
      overflow hidden
      &::before
        content '';
        position absolute
        top 0px
        left 0px
        width calc(100% - 1px)
        height calc(100% - 1px)
        border-radius 0 0 6px 6px
        box-shadow 0 0 .5px
        transform translate(.5px, .5px)
</style>
