<template>
  <div class="divider">
    <slot />
  </div>
</template>
<style lang="stylus" scoped>
.divider
  position relative
  text-align center
  color #ccc
  margin -2px 0 -4px 0
  &::before
    content ''
    position absolute
    left 0
    top 50%
    transform translateY(-50%) scaleY(.5)
    width 100%
    height 1px
    background #eee
  .icon
    position relative
    z-index 1
    font-size 20px
    background #fff
    padding 0 5px
</style>
