<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'translation'
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
  > :first-child
    display flex
    flex-direction column
    height 100%
    overflow hidden
    > main
      flex 1
      display flex
      align-items center
      background #fff
</style>
