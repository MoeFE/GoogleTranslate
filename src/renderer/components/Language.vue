<template>
  <div class="lang">
    <div class="icon-wrap" @click="$emit('changeLanguage')">
      <Country :code="country" />
    </div>
    <input :placeholder="currentPlaceholder" :value="value" @input="$emit('input', $event.target.value)">
    <template v-if="value">
      <Icon icon="close" @click.native="$emit('input', '')" />
      <Icon icon="volume" @click.native="$emit('speak', value)" />
    </template>
  </div>
</template>
<script>
import Icon from '@/components/Icon'
import Country from '@/components/Country'
import languages from '../assets/json/languages.js'
export default {
  name: 'language',
  components: { Icon, Country },
  props: {
    country: { type: String, default: 'auto', required: true },
    value: { type: String, default: '', required: true },
    placeholder: { type: String, default: '', required: false }
  },
  computed: {
    currentPlaceholder () {
      return this.placeholder || languages[this.country]
    }
  }
}
</script>
<style lang="stylus" scoped>
font-size = 22px
.lang
  display flex
  align-items center
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
  input,
  textarea
    appearance none
    display block
    flex 1
    outline 0
    border 0
    border-radius 0
    font-size font-size
    font-weight 300
    resize none
  .icon
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
