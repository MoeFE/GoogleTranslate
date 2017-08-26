<template>
  <section>
    <Header title="Translate">
      <Icon :rotate="isAlwaysOnTop ? 0 : -45" icon="fixed" slot="fixed" @click.native="switchFixed" />
      <Icon icon="settings" slot="settings" @click.native="showSettings" />
    </Header>
    <main>
      <form action method="post" @submit.prevent>
        <Language :country="model.source.country" v-model="model.source.value" />
        <Divider>
          <Icon icon="exchange" @click.native="switchLanguage" />
        </Divider>
        <Language :country="model.target.country" v-model="model.target.value" />
      </form>
    </main>
  </section>
</template>
<script>
import { remote } from 'electron'
import Icon from '@/components/Icon'
import Header from '@/components/Header'
import Divider from '@/components/Divider'
import Language from '@/components/Language'
const Window = remote.getCurrentWindow()
const { Menu, MenuItem } = remote
export default {
  name: 'transition-page',
  components: { Icon, Header, Divider, Language },
  data () {
    return {
      isAlwaysOnTop: Window.isAlwaysOnTop(),
      model: {
        source: { country: 'auto', value: '' },
        target: { country: 'zh-CN', value: '' }
      }
    }
  },
  methods: {
    switchFixed () {
      this.isAlwaysOnTop = !Window.isAlwaysOnTop()
      Window.setAlwaysOnTop(!Window.isAlwaysOnTop())
    },
    showSettings () {
      const menu = new Menu()
      menu.append(new MenuItem({ label: '偏好设置', accelerator: 'Cmd+,' }))
      menu.append(new MenuItem({ type: 'separator' }))
      menu.append(new MenuItem({ label: '切换语言', accelerator: 'Cmd+S' }))
      menu.append(new MenuItem({ label: '更改源语言', accelerator: 'Cmd+1' }))
      menu.append(new MenuItem({ label: '切换目标语言', accelerator: 'Cmd+2' }))
      menu.append(new MenuItem({ label: '说源语言', accelerator: 'Shift+Cmd+1', enabled: false }))
      menu.append(new MenuItem({ label: '说目标语言', accelerator: 'Shift+Cmd+2', enabled: false }))
      menu.append(new MenuItem({ type: 'separator' }))
      menu.append(new MenuItem({ label: '退出 Google Translate', accelerator: 'Cmd+Q' }))
      menu.popup(Window)
    },
    switchLanguage () {
      if (this.model.source.country === 'auto') return // 检测语言不能掉换
      [this.model.source, this.model.target] = [this.model.target, this.model.source]
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
