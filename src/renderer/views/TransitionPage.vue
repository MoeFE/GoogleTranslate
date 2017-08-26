<template>
  <section>
    <Header title="Translate">
      <Icon icon="fixed" slot="fixed" />
      <Icon icon="settings" slot="settings" />
    </Header>
    <main>
      <form action method="post" @submit.prevent>
        <Language country="auto" v-model="model.source" />
        <Divider>
          <Icon icon="exchange" />
        </Divider>
        <Language country="zh-CN" v-model="model.target" />
      </form>
    </main>
  </section>
</template>
<script>
import Icon from '@/components/Icon'
import Header from '@/components/Header'
import Divider from '@/components/Divider'
import Language from '@/components/Language'
export default {
  name: 'transition-page',
  components: { Icon, Header, Divider, Language },
  data () {
    return {
      model: {
        source: '',
        target: ''
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
section
  display flex
  flex-direction column
  height 100%
  &::before
    content '\e601'
    display block
    color #4286f5
    font-family icon
    font-size 32px
    text-align center
    line-height .3
    transform rotate(180deg)
main
  flex 1
  display flex
  align-items center
  background #fff
  >:first-child
    flex 1
</style>
