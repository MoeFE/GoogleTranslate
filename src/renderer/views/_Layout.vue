<template>
  <section>
    <vHeader>
      <button class="close" type="button" slot="settings" @click="$emit('close')">关闭</button>
    </vHeader>
    <main>
      <slot />
    </main>
  </section>
</template>
<script>
import vHeader from '@/components/Header'
export default {
  name: 'layout',
  components: { vHeader }
}
</script>
<style lang="stylus" scoped>
.close
  display flex
  align-items center
  appearance none
  text-decoration none
  cursor default
  position absolute
  top 0
  right 0
  height 100%
  color #fff
  background inherit
  outline 0
  border 0
  border-radius 0 6px 0 0
  padding 0 20px
  font-size 14px
  font-weight 500
  transition .3s
  &:active
    box-shadow 0px 0px 30px rgba(0, 0, 0, .2) inset
  &::before
    content ''
    position absolute
    top 0
    left 0
    width 1px
    height 100%
    background #357df3
main
  flex-direction column
  > *
    width 100%
</style>
