<template>
  <div class="shortcut">
    <span v-if="isCombin" class="key-icon">{{ key.icon }}</span>
    <span class="key">{{ isCombin ? key.text : key }}</span>
  </div>
</template>
<script>
const keyCombination = {
  Alt: { icon: '⌥', text: 'alt' },
  Control: { icon: '⌃', text: 'ctrl' },
  Meta: { icon: '⌘', text: 'cmd' },
  Shift: { icon: '⇧', text: 'shift' }
}
export default {
  props: {
    keys: { type: String, default: '', required: true }
  },
  computed: {
    key () {
      return keyCombination[this.keys] || this.keys
    },
    isCombin () {
      return Boolean(keyCombination[this.keys])
    }
  }
}
</script>
<style lang="stylus" scoped>
.shortcut
  display inline-flex
  flex-direction column
  justify-content space-around
  align-items center
  position relative
  width 45px
  height 45px
  border-radius 5px
  margin-right 10px
  padding 0 3px
  border 1px solid #c2c7cc
  box-shadow 0 0 2px rgba(0, 0, 0, .1)
  box-sizing border-box
  color #000
  background #fff
  font-weight 500
  .key-icon
    font-size 18px
    align-self flex-end
    & + .key
      font-size 9px
      align-self flex-end
      font-family inherit
  .key
    font-size 24px
    font-family arial
</style>
