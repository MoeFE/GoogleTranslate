<template>
  <div ref="lang" class="lang">
    <div class="icon-wrap" @click="$emit('changeLanguage')">
      <Country :code="country" />
    </div>
    <Textbox :placeholder="currentPlaceholder" v-model="currentValue" @keydown.enter.prevent.stop.native />
    <div v-if="value" class="action" :style="{ alignSelf: false ? 'flex-start' : 'center' }">
      <Icon icon="close" @click.native="$emit('input', '')" />
      <Icon icon="volume" @click.native="$emit('speak', value)" />
    </div>
  </div>
</template>
<script>
import Icon from '@/components/Icon'
import Country from '@/components/Country'
import Textbox from '@/components/Textbox'
import languages from '../assets/json/languages.js'
export default {
  name: 'language',
  components: { Icon, Country, Textbox },
  props: {
    country: { type: String, default: 'auto', required: true },
    value: { type: String, default: '', required: true },
    placeholder: { type: String, default: '', required: false }
  },
  data () {
    return {
      currentValue: ''
    }
  },
  mounted () {
    this.initHeight = this.$refs.lang.offsetHeight
  },
  watch: {
    value () {
      this.currentValue = this.value
    },
    currentValue () {
      this.$emit('input', this.currentValue)
      this.updateWindowHeight()
    }
  },
  computed: {
    currentPlaceholder () {
      return this.placeholder || languages[this.country]
    }
  },
  methods: {
    updateWindowHeight () {
      this.$nextTick(function () {
        const margin = 18
        const headerHeight = 42
        const innerHeight = [...this.$refs.lang.parentNode.children].map(el => el.offsetHeight).reduce((prev, next) => prev + next) + margin + headerHeight + 9
        window.resizeTo(window.innerWidth, innerHeight)
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
font-size = 22px
.lang
  display flex
  align-items flex-start
  padding 0 10px
  .icon-wrap
    position relative
    size = 44px
    width size
    height size
    &::after
      content '\e602'
      color #3e83f8
      font-family icon
      font-weight bold
      position absolute
      z-index 1
      left 50%
      bottom -5px
      opacity 0
      transition transform .2s cubic-bezier(0, 0.26, 0.71, 1.61)
      transform translate3d(-50%, -20px, 0)
    &:hover::after
      opacity 1
      transform translate3d(-50%, 0, 0)
    img
      position relative
      z-index 2
      width size
      height size
  .action
    display flex
    align-items center
  .icon
    align-self center
    color #ccc
    font-size font-size
    margin 0 5px
    font-color = #ccc
    hover-color = #bbb
    &:hover
      color hover-color
    &.icon-close
      position relative
      color #fff
      background font-color
      border-radius 50%
      width font-size - 4
      height font-size - 4
      font-size 14px
      &:hover
        background hover-color
      &::before
        position absolute
        top 50%
        left 50%
        transform translate3d(-50%, -50%, 0)
</style>
