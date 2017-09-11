<template>
  <Layout @close="view.animationEnd && $router.push('/')">
    <div class="container">
      <main>
        <div class="pannel">
          <h3 class="title">自动开始</h3>
          <div class="body">启动 Mac 时自动启动 Google Translate。</div>
          <vSwitch v-model="autoStart" />
        </div>
        <div class="pannel">
          <h3 class="title">定义快捷键</h3>
          <div class="body">
            <p>触手可及，使用此快捷键打开：</p>
            <InputShortcutKeys placeholder="按下按键记录快捷键" v-model="hotkey" />
          </div>
        </div>
        <div class="pannel">
          <h3 class="title">翻译引擎</h3>
          <div class="body">
            <p>设置 Google Translate 默认使用的翻译引擎：</p>
            <Radio name="engine" value="BaiDu" v-model="engine">百度</Radio>
            <Radio name="engine" value="YouDao" v-model="engine">有道</Radio>
            <Radio name="engine" value="Google" v-model="engine">谷歌</Radio>
            <Radio name="engine" value="GoogleCN" v-model="engine">谷歌（国内）</Radio>
          </div>
        </div>
      </main>
      <footer>
        <p class="help">给个 Star 鼓励一下吧 (ฅ´ω`ฅ)</p>
        <p><vLink href="https://github.com/MoeFE/GoogleTranslate">Google Translate</vLink></p>
        <p class="help">1.0.0</p>
      </footer>
    </div>
  </Layout>
</template>
<script>
import anime from 'animejs'
import AutoLaunch from 'auto-launch'
import Layout from '@/views/_Layout'
import Radio from '@/components/Radio'
import vSwitch from '@/components/Switch'
import vLink from '@/components/Link'
import InputShortcutKeys from '@/components/InputShortcutKeys'
import { remote } from 'electron'
import { WindowHelper } from '../utils'
import { SAVE_STATE } from '../store/types'
const { globalShortcut } = remote.require('electron')
const Window = remote.getCurrentWindow()
export default {
  name: 'settings-page',
  components: { Layout, Radio, vSwitch, vLink, InputShortcutKeys },
  data () {
    return {
      hotkey: '',
      view: {
        height: 660,
        animeOptions: { duration: 150, easing: 'easeOutQuart' },
        animationEnd: false
      }
    }
  },
  computed: {
    autoStart: {
      get () { return this.$store.getters.state.isAutoStart },
      set (isAutoStart) { this.$store.commit(SAVE_STATE, { ...this.$store.getters.state, isAutoStart }) }
    },
    engine: {
      get () { return this.$store.getters.state.engine },
      set (engine) { this.$store.commit(SAVE_STATE, { ...this.$store.getters.state, engine }) }
    }
  },
  watch: {
    autoStart () {
      const autoLaunch = new AutoLaunch({ name: 'Google 翻译' })
      if (this.autoStart) autoLaunch.enable()
      else autoLaunch.disable()
    },
    hotkey () {
      if (!this.hotkey) globalShortcut.unregisterAll()
      else globalShortcut.register(this.hotkey, () => Window.isVisible() ? Window.hide() : Window.show())
    }
  },
  mounted () {
    WindowHelper.setSize(window.innerWidth, this.view.height, this.view.animeOptions)
    document.querySelectorAll('.pannel').forEach(el => (el.style.transform = 'translateY(40px)'))
    anime({
      targets: '.pannel',
      delay: (el, index) => index * 50,
      translateY: 0,
      translateZ: 0,
      complete: () => (this.view.animationEnd = true)
    })
  }
}
</script>
<style lang="stylus" scoped>
.pannel
  position relative
  padding 15px 20px
  margin-bottom 20px
  border-radius 6px
  background #ededed
  box-sizing border-box
  .title
    color #333
    font-size 16px
    font-weight 500
    margin 0
    margin-bottom 10px
  .body
    color #666
    font-size 14px
    margin 0
  .switch
    position absolute
    top 10px
    right 20px
.container
  display flex
  flex-direction column
  height 100vh
  padding 20px
  box-sizing border-box
  font-size 14px
  position relative
  z-index 1
  main
    flex 1
    margin-bottom 20px
  footer
    text-align center
    p
      margin 5px 0
      &:nth-last-of-type(1)
        margin 0
  .help
    color #9ca3a9
    font-size 12px
</style>
