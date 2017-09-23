<template>
  <section ref="container" v-hotkey="keymap">
    <vHeader ref="header" title="Translate">
      <Icon :rotate="isAlwaysOnTop ? 0 : -45" icon="fixed" slot="fixed" @click.native="switchFixed" />
      <Icon icon="settings" slot="settings" @click.native="showSettings" />
    </vHeader>
    <main ref="main">
      <form ref="form" action method="post" style="transform: translateY(-40px) translateZ(0)" @submit.prevent>
        <Language 
          :clear="!!model.source.value && !model.source.progress.type"
          :speak="!!model.source.value && model.source.country !== 'auto' && !model.source.progress.type"
          :country="model.source.country" 
          @clear="clearSourceValue" 
          @speak="speakLanguage('source')" 
          @changeLanguage="changeSourceLanguage"
        >
          <TextBox 
            ref="source"
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
          @speak="speakLanguage('target')" 
          @changeLanguage="changeTargetLanguage" 
        >
          <TextBox  
            ref="target" 
            :readonly="model.source.country === 'auto'"
            :placeholder="languages[model.target.country]" 
            :error="hasError"
            v-model="model.target.value" 
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
import { SAVE_STATE } from '../store/types'
import anime from 'animejs'
import Icon from '@/components/Icon'
import vHeader from '@/components/Header'
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
  components: { Icon, vHeader, Divider, Language, TextBox, ProgressBar },
  data () {
    return {
      languages,
      query: this.$route.query,
      isAlwaysOnTop: this.$store.getters.state.isAlwaysOnTop,
      hasError: false,
      audio: new Audio(),
      model: {
        source: { country: this.$store.getters.state.source, value: '', progress: { type: '', duration: 0 } },
        target: { country: this.$store.getters.state.target, value: '', progress: { type: '', duration: 0 } }
      },
      view: {
        height: 190,
        mainMargin: 18,
        shadowHeight: 19,
        headerHeight: 42,
        loading: false
      },
      keymap: {
        'meta+,': this.goSettings,
        'meta+s': this.switchLanguage,
        'meta+shift+1': this.changeSourceLanguage,
        'meta+shift+2': this.changeTargetLanguage,
        'meta+1': () => this.speakLanguage('source'),
        'meta+2': () => this.speakLanguage('target'),
        'meta+ctrl+1': () => this.translation('BaiDu'),
        'meta+ctrl+2': () => this.translation('YouDao'),
        'meta+ctrl+3': () => this.translation('Google'),
        'meta+ctrl+4': () => this.translation('GoogleCN'),
        'meta+q': () => remote.app.quit()
      }
    }
  },
  computed: {
    engine () {
      return this.$store.getters.state.engine
    }
  },
  created () {
    this.$watch('model.source.value', () => {
      this.view.loading = false
      this.model.target.value = ''
      this.model.target.progress.type = ''
      this.model.source.progress.type = ''
      this.updateWindowHeight()
    })
    this.$watch('model.target.value', this.updateWindowHeight)
  },
  activated () {
    // 更新查询字符串
    this.query = this.$route.query
    // 判断是否需要修改语言
    if (this.query.lang) {
      // 获取要修改的对象
      const model = this.model[this.query.action]
      // 判断源语言是否发生改变
      if (model.country !== this.query.lang) {
        // 发生改变时才修改
        model.country = this.query.lang
        // 保存状态
        this.$store.commit(SAVE_STATE, { ...this.$store.getters.state, source: this.model.source.country, target: this.model.target.country })
      }
    }
    // 调整窗口大小
    WindowHelper.setSize(window.innerWidth, this.view.height, { duration: 150, easing: 'easeOutQuart' })
    // 添加动效
    anime({ targets: 'form', translateY: 0, translateZ: 0 })
    // 手动触发一次翻译确保结结果正确
    // 每次都触发 用户可能切换了翻译引擎
    setTimeout(() => this.translation(), 200)
  },
  deactivated () {
    // 重置 translate 确保下次进入时有动效
    this.$refs.form.style.transform = 'translateY(-40px)'
  },
  methods: {
    switchFixed () {
      this.isAlwaysOnTop = !Window.isAlwaysOnTop()
      this.$store.commit(SAVE_STATE, { ...this.$store.getters.state, isAlwaysOnTop: this.isAlwaysOnTop })
      Window.setAlwaysOnTop(this.isAlwaysOnTop)
    },
    showSettings () {
      const menu = new Menu()
      menu.append(new MenuItem({ label: '偏好设置', accelerator: 'Cmd+,', click: this.goSettings }))
      menu.append(new MenuItem({ type: 'separator' }))
      menu.append(new MenuItem({ label: '切换语言', accelerator: 'Cmd+S', enabled: this.model.source.country !== 'auto', click: this.switchLanguage }))
      menu.append(new MenuItem({ label: '更改源语言', accelerator: 'Shift+Cmd+1', click: this.changeSourceLanguage }))
      menu.append(new MenuItem({ label: '更改目标语言', accelerator: 'Shift+Cmd+2', click: this.changeTargetLanguage }))
      menu.append(new MenuItem({ label: '说源语言', accelerator: 'Cmd+1', enabled: !!this.model.source.value && this.model.source.country !== 'auto', click: () => this.speakLanguage('source') }))
      menu.append(new MenuItem({ label: '说目标语言', accelerator: 'Cmd+2', enabled: !!this.model.target.value, click: () => this.speakLanguage('target') }))
      menu.append(new MenuItem({ type: 'separator' }))
      menu.append(new MenuItem({ label: '使用百度翻译', accelerator: 'Ctrl+Cmd+1', enabled: !!this.model.source.value, click: () => this.translation('BaiDu') }))
      menu.append(new MenuItem({ label: '使用有道翻译', accelerator: 'Ctrl+Cmd+2', enabled: !!this.model.source.value, click: () => this.translation('YouDao') }))
      menu.append(new MenuItem({ label: '使用谷歌翻译', accelerator: 'Ctrl+Cmd+3', enabled: !!this.model.source.value, click: () => this.translation('Google') }))
      menu.append(new MenuItem({ label: '使用谷歌（国内）', accelerator: 'Ctrl+Cmd+4', enabled: !!this.model.source.value, click: () => this.translation('GoogleCN') }))
      menu.append(new MenuItem({ type: 'separator' }))
      menu.append(new MenuItem({ label: '退出 Google 翻译', accelerator: 'Cmd+Q', click: remote.app.quit }))
      menu.popup(Window)
    },
    async clearSourceValue () {
      this.model.source.value = ''
      await Thread.sleep()
      this.$refs.source.$el.focus()
    },
    async switchLanguage () {
      if (this.model.source.country === 'auto') return // 检测语言不能掉换
      [this.model.source, this.model.target] = [this.model.target, this.model.source]
      this.$store.commit(SAVE_STATE, { ...this.$store.getters.state, source: this.model.source.country, target: this.model.target.country })
      await Thread.sleep()
      this.view.loading = Boolean(this.model.source.value)
      const targets = this.$refs.switch.$el
      targets.style.transform = 'rotate(0deg)'
      anime({
        targets,
        rotate: '180deg',
        complete: () => this.view.loading && this.translation()
      })
    },
    goSettings () {
      this.$router.push({ name: 'settings-page' })
    },
    changeSourceLanguage () {
      this.$router.push({ name: 'change-language-page', query: { from: 'source', active: this.model.source.country } })
    },
    changeTargetLanguage () {
      this.$router.push({ name: 'change-language-page', query: { from: 'target', active: this.model.target.country } })
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
    async targetInputHandler (evt) {
      await Thread.sleep()
      if (this.$refs.target.isComposition) return // 输入法未上屏
      if (this.model.source.country === 'auto') return // 检测语言不能掉换
      [this.model.source, this.model.target] = [this.model.target, this.model.source]
      this.model.source.value = evt.target.innerText
      this.model.target.value = ''
      this.$refs.source.$el.focus()
    },
    async speakLanguage (action) {
      if (!this.model[action].value) return
      if (this.model[action].country === 'auto') return
      this.model[action].progress.type = 'loading'
      await Thread.sleep(500)
      let from = this.model[action].country
      if (this.engine !== 'YouDao') { // 有道翻译不支持 detect
        const lang = await tjs.detect({ api: this.engine, text: this.model[action].value })
        if (lang) from = lang
      }
      const audioUrl = await tjs.audio({ api: this.engine, text: this.model[action].value, from: from === 'auto' ? void 0 : from })
      if (!audioUrl) {
        this.model[action].progress.type = ''
        return
      }
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
    async translation (engine) {
      if (!this.model.source.value) return
      this.model.target.value = ''
      this.view.loading = true
      await Thread.sleep(200) // 至少延迟 200ms 否则会导致窗口抖动
      try {
        const json = await tjs.translate({
          api: typeof engine === 'string' ? engine : this.engine,
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
      } catch (ex) {
        this.view.loading = false
        this.hasError = true
        this.model.target.value = !navigator.onLine ? '网络连接已中断' : '网络繁忙，请稍后再试'
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
