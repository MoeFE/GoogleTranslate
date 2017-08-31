<template>
  <div ref="lang" class="lang">
    <div class="icon-wrap" @click="$emit('changeLanguage')">
      <Country :code="country" />
    </div>
    <Loading v-if="loading" />
    <slot v-else />
    <div class="action">
      <Icon v-if="clear" icon="clear" @click.native="$emit('clear')" />
      <Icon :style="{ visibility: speak ? '' : 'hidden' }" icon="speak" @click.native="$emit('speak')" />
    </div>
  </div>
</template>
<script>
import Icon from '@/components/Icon'
import Loading from '@/components/Loading'
import Country from '@/components/Country'
export default {
  name: 'language',
  components: { Icon, Loading, Country },
  props: {
    country: { type: String, default: 'auto', required: true },
    clear: { type: Boolean, default: true, required: false },
    speak: { type: Boolean, default: true, required: false },
    loading: { type: Boolean, default: false, required: false }
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
    align-self flex-start
    align-items center
    margin 10px 0
  .icon
    align-self center
    color #ccc
    font-size font-size
    margin 0 5px
    font-color = #ccc
    hover-color = #bbb
    &:hover
      color hover-color
    &.icon-clear
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
