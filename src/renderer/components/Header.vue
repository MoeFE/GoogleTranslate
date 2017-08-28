<template>
  <header>
    <slot name="fixed" />
    <h1>Googl<i>e</i> {{ title }}</h1>
    <slot name="settings" />
  </header>
</template>
<script>
export default {
  name: 'header',
  props: {
    title: { type: String, default: 'Translate', required: false }
  }
}
</script>

<style lang="stylus" scoped>
header
  display flex
  align-items center
  position relative
  z-index 9
  color #fff
  background #4286f5
  padding 10px
  border-radius 6px 6px 0 0
  .icon
    position absolute
    color #fff
    text-shadow 0 0 10px rgba(255, 255, 255, 0)
    transition text-shadow .3s
    &:nth-of-type(1)
      left 10px
    &:nth-of-type(2)
      right 10px
    &:hover
      text-shadow 0 0 10px rgba(255, 255, 255, .5)
  .icon-fixed
    transition .3s
    transform rotate(-45deg)
  .icon-settings::after
    content '\e601'
    font-family icon
  > *
    font-size 18px
  h1
    margin 0
    font-family google
    font-weight: 500
    text-align center
    flex 1
    i
      display inline-block
      font-style normal
      transform rotate(-10deg)
</style>
