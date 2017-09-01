<template>
  <div v-if="type === 'progress'" role="progressbar" ref="progress">
    <svg viewBox="0 0 100 100">
      <path :d="path" stroke="transparent" :stroke-width="width" fill-opacity="0"></path>
      <path :d="path" stroke="#3e83f8" :stroke-width="width" fill-opacity="0" :style="stroke"></path>
    </svg>
    <div class="pause" @click="$emit('pause')"></div>
  </div>
  <i v-else-if="type === 'loading'" class="loading"></i>
</template>
<script>
import anime from 'animejs'
export default {
  name: 'progressbar',
  props: {
    type: { type: String, default: 'loading', required: false },
    width: { type: Number, default: 7, required: false },
    duration: { type: Number, default: 1000, required: false },
    easing: { type: String, default: 'linear', required: false }
  },
  data () {
    return {
      path: 'M 50,50 m 0,-47 a 47,47 0 1 1 0,94 a 47,47 0 1 1 0,-94',
      stroke: {
        strokeDasharray: '295.416, 295.416',
        strokeDashoffset: '295.416'
      }
    }
  },
  methods: {
    async run (percent) {
      await this.$nextTick()
      return new Promise(resolve => {
        // const total = Number.parseFloat(this.stroke.strokeDashoffset)
        // const strokeDashoffset = percent ? (1 - percent) * total : 0
        anime({
          targets: this.stroke,
          easing: this.easing,
          duration: this.duration,
          strokeDashoffset: 0,
          complete: resolve
        })
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
size = 28px
div[role="progressbar"]
  position relative
  display inline-block
  width size
  height size
  .pause
    display flex
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    font-size 0
    &::before,
    &::after
      content ''
      display inline-block
      width 3px
      height 12px
      margin 0 2px
      background: #3e83f8
.loading
  position relative
  width size
  height size
  border-radius size
  border 2px solid transparent
  border-top-color rgba(62, 131, 248, 1)
  border-right-color rgba(62, 131, 248, 1)
  border-bottom-color rgba(62, 131, 248, 0)
  border-left-color rgba(62, 131, 248, 0)
  box-sizing border-box
  background #fff
  background-clip padding-box
  animation loading .8s linear infinite
  @keyframes loading
    0%
      transform rotate(0deg)
    100%
      transform rotate(360deg)
</style>
