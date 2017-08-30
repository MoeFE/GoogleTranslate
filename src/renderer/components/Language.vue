<template>
  <div ref="lang" class="lang">
    <div class="icon-wrap" @click="$emit('changeLanguage')">
      <Country :code="country" />
    </div>
    <Textbox :readonly="readonly" :placeholder="currentPlaceholder" v-model="currentValue" @keydown.enter.prevent.stop.native />
    <div v-if="value" class="action" :style="{ alignSelf: false ? 'flex-start' : 'center' }">
      <Icon icon="close" @click.native="$emit('input', '')" />
      <Icon icon="volume" @click.native="$emit('speak', value)" />
    </div>
  </div>
</template>
<script>
import { WindowHelper } from '../utils'
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
    placeholder: { type: String, default: '', required: false },
    readonly: { type: Boolean, default: false, required: false }
  },
  data () {
    return {
      currentValue: '',
      config: {}
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
        const formHeight = this.$refs.lang.parentNode.offsetHeight
        if (!this.config.firstChild) this.config.firstChild = document.querySelector('#app').firstChild
        if (!this.config.headerHeight) this.config.headerHeight = this.config.firstChild.querySelector('header').offsetHeight
        if (!this.config.margin) this.config.margin = this.config.firstChild.querySelector('main').offsetHeight - formHeight
        const innerHeight = formHeight + this.config.margin + this.config.headerHeight + (window.innerHeight - this.config.firstChild.offsetHeight)
        WindowHelper.setSize(window.innerWidth, innerHeight, {
          duration: 150,
          easing: 'easeOutSine'
        })
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
      transition transform .2s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
