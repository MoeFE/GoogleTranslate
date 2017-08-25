<template>
  <div class="lang">
    <img :src="`http://api.itranslateapp.com/flags/${country}-2x.png`">
    <input :placeholder="currentPlaceholder" :value="value" @input="$emit('input', $event.target.value)">
    <template v-if="value">
      <Icon icon="close" @click.native="$emit('input', '')" />
      <Icon icon="volume" @click.native="$emit('speak', value)" />
    </template>
  </div>
</template>
<script>
import Icon from '@/components/Icon'
import country from '../assets/json/languages.js'
export default {
  name: 'language',
  components: { Icon },
  props: {
    country: { type: String, default: 'auto', required: true },
    value: { type: String, default: '', required: true },
    placeholder: { type: String, default: '', required: false }
  },
  computed: {
    currentPlaceholder () {
      return this.placeholder || country[this.country]
    }
  }
}
</script>
<style lang="stylus" scoped>
font-size = 22px
.lang
  display flex
  align-items center
  padding-right 10px
  img
    size = 44
    width 44px
    height 44px
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
