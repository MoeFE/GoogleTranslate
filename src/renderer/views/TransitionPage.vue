<template>
  <section ref="container" v-hotkey="keymap">
    <Header ref="header" title="Translate">
      <Icon :rotate="isAlwaysOnTop ? 0 : -45" icon="fixed" slot="fixed" @click.native="switchFixed" />
      <Icon icon="settings" slot="settings" @click.native="showSettings" />
    </Header>
    <main ref="main">
      <form ref="form" action method="post" style="transform: translateY(-40px)" @submit.prevent>
        <Language 
          :clear="!!model.source.value"
          :speak="!!model.source.value"
          :country="model.source.country" 
          @clear="model.source.value = ''" 
          @speak="speakSourceLanguage" 
          @changeLanguage="changeSourceLanguage"
        >
          <TextBox 
            :placeholder="languages[model.source.country]" 
            v-model="model.source.value" 
            @keydown.enter.prevent.stop.native="translation" 
          />
        </Language>
        <Divider>
          <Icon icon="switch" @click.native="switchLanguage" />
        </Divider>
        <Language 
          :clear="false" 
          :speak="!!model.target.value"
          :country="model.target.country" 
          :loading="view.loading"
          @clear="model.target.value = ''" 
          @speak="speakTargetLanguage" 
          @changeLanguage="changeTargetLanguage" 
        >
          <TextBox  
            ref="target" 
            :readonly="model.source.country === 'auto'"
            :placeholder="languages[model.target.country]" 
            :error="hasError"
            :value="model.target.value" 
            @input.native="targetInputHandler"
          />
        </Language>
      </form>
    </main>
  </section>
</template>
<script>
import { remote } from 'electron'
import { WindowHelper, Thread } from '../utils'
import anime from 'animejs'
import Icon from '@/components/Icon'
import Header from '@/components/Header'
import Divider from '@/components/Divider'
import Language from '@/components/Language'
import TextBox from '@/components/TextBox'
import languages from '../assets/json/languages.js'
import tjs from 'translation.js'
tjs.add(new tjs.BaiDu())
tjs.add(new tjs.Google())
tjs.add(new tjs.GoogleCN())
tjs.add(new tjs.YouDao({
  apiKey: '1361128838',
  keyFrom: 'chrome'
}))
const Window = remote.getCurrentWindow()
const { Menu, MenuItem } = remote
export default {
  name: 'transition-page',
  components: { Icon, Header, Divider, Language, TextBox },
  data () {
    return {
      languages,
      query: this.$route.query,
      isAlwaysOnTop: Window.isAlwaysOnTop(),
      hasError: false,
      model: {
        source: { country: 'auto', value: '' },
        target: { country: 'zh-CN', value: '' }
      },
      view: {
        height: 190,
        mainMargin: 18,
        shadowHeight: 19,
        headerHeight: 42,
        loading: false
      },
      keymap: {
        'meta+s': this.switchLanguage,
        'meta+1': this.changeSourceLanguage,
        'meta+2': this.changeTargetLanguage,
        'meta+shift+1': this.speakSourceLanguage,
        'meta+shift+2': this.speakTargetLanguage
      }
    }
  },
  created () {
    if (this.query.lang) this.model[this.query.action].country = this.query.lang
    this.$watch('model.source.value', () => {
      this.model.target.value = ''
      this.updateWindowHeight()
    })
    this.$watch('model.target.value', this.updateWindowHeight)
    WindowHelper.setSize(window.innerWidth, this.view.height, { duration: 200, easing: 'easeOutQuart' })
  },
  mounted () {
    anime({ targets: 'form', translateY: 0, translateZ: 0 })
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
      this.$router.push({ name: 'change-language-page', query: { from: 'source', active: this.model.source.country } })
    },
    changeTargetLanguage () {
      this.$router.push({ name: 'change-language-page', query: { from: 'target', active: this.model.source.country } })
    },
    async updateWindowHeight () {
      await Thread.sleep()
      const innerHeight =
      [...this.$refs.form.children].map(el => el.offsetHeight).reduce((prev, next) => prev + next) +
      this.view.shadowHeight +
      this.view.headerHeight +
      this.view.mainMargin
      WindowHelper.setSize(window.innerWidth, innerHeight, { duration: 200, easing: 'easeOutQuart' })
    },
    targetInputHandler () {
      if (this.model.source.country === 'auto') return // 检测语言不能掉换
      [this.model.source, this.model.target] = [this.model.target, this.model.source]
      this.model.source.value = event.target.innerText
      this.model.target.value = ''
    },
    async speakSourceLanguage () {
      const from = this.model.source.country
      const audioUrl = await tjs.audio({ api: 'GoogleCN', text: this.model.source.value, from: from === 'auto' ? void 0 : from })
      new Audio(audioUrl).play()
    },
    async speakTargetLanguage () {
      const audioUrl = await tjs.audio({ api: 'GoogleCN', text: this.model.target.value, from: this.model.target.country })
      new Audio(audioUrl).play()
    },
    async translation () {
      this.model.target.value = ''
      this.view.loading = true
      const json = await tjs.translate({
        api: 'GoogleCN',
        text: this.model.source.value,
        from: this.model.source.country,
        to: this.model.target.country
      })
      this.view.loading = false
      if (json.result && json.result.length > 0) {
        this.hasError = false
        this.model.target.value = json.result.join('\n')
      } else {
        this.hasError = true
        this.model.target.value = json.error
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
main
  align-items flex-start !important
form
  flex 1
  margin 9px 0
</style>
