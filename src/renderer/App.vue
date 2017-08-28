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
