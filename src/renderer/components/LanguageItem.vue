<template>
  <li :class="{ active }">
    <Country :code="country" />
    <span v-if="text">{{ text }}</span>
    <span v-else><slot /></span>
  </li>
</template>
<script>
import Country from '@/components/Country'
export default {
  name: 'language-item',
  components: { Country },
  props: {
    active: { type: Boolean, default: false, required: false },
    country: { type: String, default: 'auto', required: true },
    text: { type: String, default: '', required: false }
  }
}
</script>

<style lang="stylus" scoped>
li
  display flex
  align-items center
  padding 0 15px
  &.active
    color #3e83f8
  &:hover
    color #fff
    background #3e83f8
  img
    size = 44px
    width size
    height size
    margin-right 10px
</style>
