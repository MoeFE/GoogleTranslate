<template>
  <section>
    <Header title="Translate">
      <Icon :rotate="isAlwaysOnTop ? 0 : -45" icon="fixed" slot="fixed" @click.native="switchFixed" />
      <Icon icon="settings" slot="settings" @click.native="showSettings" />
    </Header>
    <main>
      <form action method="post" style="transform: translateY(-40px)" @submit.prevent>
        <Language :country="model.source.country" v-model="model.source.value" @changeLanguage="changeSourceLanguage" />
        <Divider>
          <Icon icon="exchange" @click.native="switchLanguage" />
        </Divider>
        <Language :country="model.target.country" v-model="model.target.value" @changeLanguage="changeTargetLanguage" />
      </form>
    </main>
  </section>
</template>
<script>
import { remote } from 'electron'
import anime from 'animejs'
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
      query: this.$route.query,
      model: {
        source: { country: 'auto', value: '' },
        target: { country: 'zh-CN', value: '' }
      }
    }
  },
  beforeCreate () {
    window.resizeTo(400, 180)
  },
  created () {
    if (this.query.action) this.model[this.query.action] = this.query.lang
  },
  mounted () {
    anime({
      targets: 'form',
      translateY: 0
    })
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
      menu.append(new MenuItem({ label: '切换语言', accelerator: 'Cmd+S', enabled: this.model.source.country !== 'auto', click: this.switchLanguage }))
      menu.append(new MenuItem({ label: '更改源语言', accelerator: 'Cmd+1', click: this.changeSourceLanguage }))
      menu.append(new MenuItem({ label: '更改目标语言', accelerator: 'Cmd+2', click: this.changeTargetLanguage }))
      menu.append(new MenuItem({ label: '说源语言', accelerator: 'Shift+Cmd+1', enabled: !!this.model.source.value, click: this.speakSourceLanguage }))
      menu.append(new MenuItem({ label: '说目标语言', accelerator: 'Shift+Cmd+2', enabled: !!this.model.target.value, click: this.speakTargetLanguage }))
      menu.append(new MenuItem({ type: 'separator' }))
      menu.append(new MenuItem({ label: '退出 Google 翻译', accelerator: 'Cmd+Q', click: remote.app.quit }))
      menu.popup(Window)
    },
    switchLanguage () {
      if (this.model.source.country === 'auto') return // 检测语言不能掉换
      [this.model.source, this.model.target] = [this.model.target, this.model.source]
    },
    changeSourceLanguage () {
      this.$router.push({ name: 'change-language-page', query: { from: 'source', active: this.model.source } })
    },
    changeTargetLanguage () {
      this.$router.push({ name: 'change-language-page', query: { from: 'target', active: this.model.source } })
    },
    speakSourceLanguage () {},
    speakTargetLanguage () {}
  }
}
</script>
<style lang="stylus" scoped>
main
  align-items flex-start !important
  > form
    flex 1
    margin 9px 0
</style>
