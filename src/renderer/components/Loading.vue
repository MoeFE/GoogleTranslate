<template>
  <div class="loading">
    <i v-for="n in 3" :key="n"></i>
  </div>
</template>
<style lang="stylus" scoped>
size = 4px
.loading
  display flex
  align-items center
  align-self center
  @keyframes loading
    0%
      opacity .5
      transform scale(1)
    25%
      opacity .75
      transform scale(1.5)
    50%
      opacity 1
      transform scale(2)
    100%
      opacity .5
      transform scale(1)
  > i
    display inline-block
    width size
    height size
    border-radius size
    margin 0 3px
    opacity .5
    background #3e83f8
    easeOutSine = cubic-bezier(0.39, 0.575, 0.565, 1)
    easeOutCubic = cubic-bezier(0.215, 0.61, 0.355, 1)
    easeOutCirc = cubic-bezier(0.075, 0.82, 0.165, 1)
    easeOutQuint = cubic-bezier(0.23, 1, 0.32, 1)
    easeOutExpo = cubic-bezier(0.19, 1, 0.22, 1)
    easeOutQuart = cubic-bezier(0.165, 0.84, 0.44, 1)
    duration = .6s
    easing = easeOutQuart
    &:nth-of-type(1)
      animation loading duration easing .1s infinite
    &:nth-of-type(2)
      animation loading duration easing .2s infinite
    &:nth-of-type(3)
      animation loading duration easing .3s infinite
</style>
