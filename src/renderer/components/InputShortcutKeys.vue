<template>
  <div 
    role="text" 
    contenteditable="true" 
    tabindex="-1"
    :placeholder="placeholder" 
    @focus="keys = []" 
    @keyup="keyupHandler"
    @keydown="keydownHandler">
    <ShortcutKeys v-for="key in keys" :key="key" :keys="key" />
  </div>
</template>
<script>
import Icon from '@/components/Icon'
import ShortcutKeys from '@/components/ShortcutKeys'
const keyCombination = ['Alt', 'Control', 'Meta', 'Shift']
export default {
  name: 'input-shortcut-keys',
  components: { Icon, ShortcutKeys },
  props: {
    value: { type: String, default: '', required: true },
    placeholder: { type: String, default: '', required: false }
  },
  data () {
    return {
      keys: []
    }
  },
  computed: {
    distinctKeys () {
      return [...new Set(this.keys)]
    },
    hasTargetKeys () {
      let targetKey = null
      this.distinctKeys.forEach(key => {
        if (!keyCombination.includes(key)) targetKey = key
      })
      return Boolean(targetKey)
    }
  },
  watch: {
    keys () {
      if (this.hasTargetKeys || this.keys.length === 0) {
        this.$emit('input', this.distinctKeys.join('+').replace('Meta', 'Cmd'))
      }
    }
  },
  methods: {
    keyupHandler () {
      if (!this.hasTargetKeys) this.keys = []
    },
    keydownHandler () {
      const { key, target } = event
      this.keys.push(key)
      if (!keyCombination.includes(key)) target.blur()
    }
  }
}
</script>

<style lang="stylus" scoped>
div[role="text"]
  display flex
  align-items center
  position relative
  appearance none
  outline 0
  border 1px solid transparent
  border-radius 4px
  font-size 12px
  font-weight 300
  width 100%
  height 55px
  padding 5px
  background #fff
  box-shadow 0 .5px .5px rgba(0, 0, 0, .1)
  box-sizing border-box
  -webkit-user-modify read-only
  &:focus
    border 1px solid #199bff
  &:empty::before
    content attr(placeholder)
    color #bbb
    padding 0 10px
  .icon-clear
    size = 16px
    display flex
    justify-content center
    align-items center
    position absolute
    top 50%
    right 5px
    transform translateY(-50%)
    width size
    height size
    border-radius size
    font-size 12px
    font-weight 600
    margin-right 5px
    color #fff
    background #ccc
    &:hover
      background #bbb
</style>
