<template>
  <section ref="container" v-hotkey="keymap">
    <Header ref="header" title="Translate">
      <Icon :rotate="isAlwaysOnTop ? 0 : -45" icon="fixed" slot="fixed" @click.native="switchFixed" />
      <Icon icon="settings" slot="settings" @click.native="showSettings" />
    </Header>
    <main ref="main">
      <form ref="form" action method="post" style="transform: translateY(-40px)" @submit.prevent>
        <Language 
          :clear="!!model.source.value && !model.source.progress.type"
          :speak="!!model.source.value && model.source.country !== 'auto' && !model.source.progress.type"
          :country="model.source.country" 
          @clear="model.source.value = ''" 
          @speak="speakLanguage('source')" 
          @changeLanguage="changeSourceLanguage"
        >
          <TextBox 
            :placeholder="languages[model.source.country]" 
            v-model="model.source.value" 
            @keydown.enter.prevent.stop.native="translation" 
          />
          <ProgressBar 
            v-if="model.source.progress.type"
            ref="sourceProgress" 
            slot="progress" 
            :type="model.source.progress.type" 
            :duration="model.source.progress.duration" 
            @pause="pauseSpeakHandler('source')"
          />
        </Language>
        <Divider>
          <Icon ref="switch" icon="switch" :class="{ disabled: this.model.source.country === 'auto' }" @click.native="switchLanguage" />
        </Divider>
        <Language 
          :clear="false" 
          :speak="!!model.target.value && !model.target.progress.type"
          :country="model.target.country" 
          :loading="view.loading"
          @clear="model.target.value = ''" 
          @speak="speakLanguage('target')" 
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
          <ProgressBar 
            v-if="model.target.progress.type"
            ref="targetProgress" 
            slot="progress" 
            :type="model.target.progress.type" 
            :duration="model.target.progress.duration" 
            @pause="pauseSpeakHandler('target')"
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
import ProgressBar from '@/components/ProgressBar'
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
  components: { Icon, Header, Divider, Language, TextBox, ProgressBar },
  data () {
    return {
      languages,
      query: this.$route.query,
      isAlwaysOnTop: Window.isAlwaysOnTop(),
      hasError: false,
      audio: new Audio(),
      model: {
        source: { country: 'auto', value: '', progress: { type: '', duration: 0 } },
        target: { country: 'zh-CN', value: '', progress: { type: '', duration: 0 } }
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
      this.view.loading = false
      this.model.target.value = ''
      this.model.target.progress.type = ''
      this.model.source.progress.type = ''
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
      menu.append(new MenuItem({ label: '说源语言', accelerator: 'Shift+Cmd+1', enabled: !!this.model.source.value, click: this.speakLanguage('source') }))
      menu.append(new MenuItem({ label: '说目标语言', accelerator: 'Shift+Cmd+2', enabled: !!this.model.target.value, click: this.speakLanguage('target') }))
      menu.append(new MenuItem({ type: 'separator' }))
      menu.append(new MenuItem({ label: '退出 Google 翻译', accelerator: 'Cmd+Q', click: remote.app.quit }))
      menu.popup(Window)
    },
    switchLanguage () {
      if (this.model.source.country === 'auto') return // 检测语言不能掉换
      [this.model.source, this.model.target] = [this.model.target, this.model.source]
      this.translation()
      const targets = this.$refs.switch.$el
      targets.style.transform = 'rotate(0deg)'
      anime({
        targets,
        rotate: '180deg'
      })
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
    async speakLanguage (action) {
      if (!this.model[action].value) return
      this.model[action].progress.type = 'loading'
      await Thread.sleep(500)
      const from = this.model[action].country
      const audioUrl = await tjs.audio({ api: 'GoogleCN', text: this.model[action].value, from: from === 'auto' ? void 0 : from })
      this.audio.onloadeddata = async () => {
        this.model[action].progress.type = 'progress'
        this.model[action].progress.duration = this.audio.duration * 1000
        this.audio.play()
        await this.$refs[`${action}Progress`].run()
        this.model[action].progress.type = ''
      }
      this.audio.src = audioUrl
    },
    pauseSpeakHandler (action) {
      this.model[action].progress.type = ''
      this.audio.pause()
    },
    async translation () {
      if (!this.model.source.value) return
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
.icon-switch
  font-weight bold
  &:not(.disabled):active
    color #3e83f8
</style>
