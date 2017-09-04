<template>
  <section>
    <aside>
      <img src="https://gss2.bdstatic.com/9fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike72%2C5%2C5%2C72%2C24/sign=00483c93ddca7bcb6976cf7ddf600006/cdbf6c81800a19d8ce78815539fa828ba61e4662.jpg">
    </aside>
    <main>
      <h4>发现新版本的 Google 翻译可用！</h4>
      <p>Google 翻译 1.1.0 可用，您现在的版本是 1.0.0，你想要现在下载吗？</p>
      <p><strong>版本记录：</strong></p>
      <div role="textbox" contenteditable="true"></div>
      <label>
        <input type="checkbox">
        <span>以后自动下载和安装更新</span>
      </label>
      <div class="button-group">
        <div class="left">
          <button>
            <span>跳过本次更新</span>
          </button>
        </div>
        <div class="right">
          <button>
            <span>稍后提醒</span>
          </button>
          <button class="primary">
            <span>立即更新</span>
          </button>
        </div>
      </div>
    </main>
  </section>
</template>
<script>
export default {
  name: 'update-page'
}
</script>
<style lang="stylus">
#app::before
  display none
</style>
<style lang="stylus" scoped>
section
  display flex
  background #ececec
  height 100vh
  padding 20px
  font-size 12px
  box-sizing border-box
aside
  width 70px
  margin-right 20px
  img
    width 100%
main
  flex 1
  h4
    margin 0
    font-size 13px
  textarea,
  [role="textbox"],
  [contenteditable="true"]
    position relative
    width 100%
    height 200px
    padding 5px
    margin-bottom 10px
    outline 0
    border 1px solid #888
    background #fff
    resize none
    -webkit-user-modify read-only
    box-sizing border-box
    &:empty::before
      content: ''
      size = 42px
      preloader = "data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%236c6c6c'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E"
      display inline-block
      width size
      height size
      position absolute
      top 0
      right 0
      bottom 0
      left 0
      margin auto
      background url(preloader) no-repeat 50% / 100%
      animation preloader-spin .8s steps(12, end) infinite
      @keyframes preloader-spin
        100%
          transform rotate(360deg)
  label
    display flex
    align-items center
    margin-bottom 10px
    input[type="checkbox"]
      margin 0
    span
      margin 0 5px
      font-size 11px
  button
    -webkit-appearance none
    position relative
    padding 3px 10px
    border 0
    border-radius 6px
    background #fff
    outline 0
    box-shadow 0px 1px 1px rgba(0, 0, 0, .1)
    > span
      position relative
      z-index 1
    &::before
      content ''
      position absolute
      top 0
      left 0
      width 200%
      height 200%
      border 1px solid #c7c7c7
      border-radius inherit
      background inherit
      box-sizing border-box
      transform scale(0.5)
      transform-origin left top
    &.primary,
    &:active
      color #fff
      background linear-gradient(#6bb3fa, #015cff) bottom
      &::before
        border-color #4ca2f9
    &.primary
      &:active
        background linear-gradient(#4996fd, #003ddb) bottom
        &::before
          border-color #247eff
  .button-group
    display flex
    justify-content space-between
    .right button
      margin 0 5px
</style>
