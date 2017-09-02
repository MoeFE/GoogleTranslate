<template>
  <div class="switch" :class="{ active, dragging }" @click.self="active = !active" @mousedown.stop="dragging = true" @mouseup.stop="dragging = false">
    <div class="handle" @mousedown.stop="dragging = true" @mouseup.stop="dragging = false"></div>
  </div>
</template>
<script>
export default {
  name: 'switch',
  props: {
    value: { type: Boolean, default: false, required: false }
  },
  data () {
    return {
      active: false,
      dragging: false
    }
  },
  watch: {
    value: {
      immediate: true,
      handler () {
        this.active = this.value
      }
    },
    active () {
      this.$emit('input', this.active)
    }
  }
}
</script>
<style lang="stylus" scoped>
.switch
  position relative
  width 50px
  height 30px
  border 1px solid #bebebe
  background transparent
  border-radius 30px
  transition .2s ease-in-out
  box-sizing border-box
  .handle
    content ''
    display inline-block
    position absolute
    z-index 1
    top 0
    left 0
    width 28px
    height 28px
    border-radius 28px
    background #fff
    box-shadow 0 2px 5px rgba(0, 0, 0, .4)
    transition .3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
  &.dragging .handle
    width 35px
    transition-duration .2s
    transition-timing-function ease-in-out
  &.active.dragging .handle
    left -7px
    width 35px
    transition-duration .2s
    transition-timing-function ease-in-out
  &.active
    border 1px solid #4cd964
    background #4cd964
    .handle
      transform translate3d(19px, 0, 0)
      transition-duration .3s
      transition-timing-function cubic-bezier(0.175, 0.885, 0.32, 1.275)
</style>
