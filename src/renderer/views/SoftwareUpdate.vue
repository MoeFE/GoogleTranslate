<template>
  <section>
    <aside>
      <img src="https://gss2.bdstatic.com/9fo3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike72%2C5%2C5%2C72%2C24/sign=00483c93ddca7bcb6976cf7ddf600006/cdbf6c81800a19d8ce78815539fa828ba61e4662.jpg">
    </aside>
    <main>
      <h4>发现新版本的 Google 翻译可用！</h4>
      <template v-if="loading">
        <p v-if="progress < 100" class="loading">
          <span v-if="connect">正在连接资源...</span>
          <span v-else>正在下载更新（状态：{{ speed }}/s - {{ transferred }}，共 {{ total }}，还剩 {{ remaining }}）</span>
        </p>
        <p v-else>下载完成</p>
        <progress max="100" :value="progress"></progress>
      </template>
      <p v-else>Google 翻译 {{ meta.name }} 可用，您现在的版本是 {{ meta.currentVersion }}，你想要现在下载吗？</p>
      <p style="margin-top: 0"><strong>版本记录：</strong></p>
      <div ref="notes" role="textbox" contenteditable="true" v-html="notes"></div>
      <label>
        <input type="checkbox">
        <span>以后自动下载和安装更新</span>
      </label>
      <div class="button-group">
        <div class="left">
          <button @click="skipUpdate" :disabled="progress >= 100">
            <span>跳过本次更新</span>
          </button>
        </div>
        <div class="right">
          <button @click="remindLater">
            <span>{{ loading && progress < 100 ? '稍后提醒' : '稍后更新' }}</span>
          </button>
          <button class="primary" @click="installUpdate">
            <span>立即更新</span>
          </button>
        </div>
      </div>
    </main>
  </section>
</template>
<script>
import anime from 'animejs'
import { remote, shell } from 'electron'
import { updater } from '../../../package.json'
import marked from 'marked'
import bytes from 'bytes'
const win = remote.getCurrentWindow()
export default {
  name: 'update-page',
  data () {
    return {
      title: 'Software Update',
      loading: false,
      connect: true,
      progress: 0,
      state: {
        percent: 0,
        speed: 0,
        size: { total: 0, transferred: 0 },
        time: { elapsed: 0, remaining: 0 }
      },
      release: {}
    }
  },
  computed: {
    meta () {
      return { ...win.updater.meta, currentVersion: win.updater.version }
    },
    notes () {
      if (!this.release.body) return null
      marked.setOptions({ breaks: true })
      return `<div class="markdown-body">${marked(this.release.body || '')}</div>`
    },
    speed () {
      const { speed } = this.state
      return bytes(speed, { unitSeparator: ' ' })
    },
    total () {
      const { size } = this.state
      return bytes(size.total, { unitSeparator: ' ' })
    },
    transferred () {
      const { size } = this.state
      return bytes(size.transferred, { unitSeparator: ' ' })
    },
    remaining () {
      const { time } = this.state
      const hover = Math.floor(time.remaining / 60 / 60)
      const minutes = Math.floor(time.remaining / 60 % 60)
      const seconds = Math.floor(time.remaining % 60)
      if (hover > 24) return '大于 24 小时'
      else if (hover > 0) return `${hover} 小时 ${minutes} 分钟`
      else if (minutes > 0) return `${minutes} 分钟`
      else return `${seconds} 秒`
    }
  },
  watch: {
    'state.percent' (newVal, oldVal) {
      const targets = { progress: oldVal * 100 }
      anime({
        targets,
        progress: newVal * 100,
        duration: 300,
        easing: 'easeOutQuart',
        update: () => (this.progress = targets.progress)
      })
    },
    async notes () {
      await this.$nextTick()
      console.log(this.$refs.notes.querySelectorAll('a'));
      [...this.$refs.notes.querySelectorAll('a')].forEach(el => {
        el.onclick = evt => {
          evt.preventDefault()
          shell.openExternal(evt.currentTarget.getAttribute('href'))
        }
      })
    }
  },
  async created () {
    document.title = this.title
    win.updater.on('update-downloaded', () => {
      document.title = this.title
      win.updater.quitAndInstall(window.confirm('是否立即重启并安装更新？'))
      win.close()
    })
    win.updater.on('update-progress', state => {
      this.loading = true
      this.connect = false
      this.state = {}
      this.state = state
      document.title = `${this.title} (${Math.round(this.state.percent * 100)}%)`
    })
    const json = await this.$http.get(updater.url)
    this.release = json.data
  },
  methods: {
    installUpdate () {
      if (this.progress >= 100) win.updater.emit('update-downloaded')
      else {
        this.loading = true
        win.updater.downloadUpdate()
      }
    },
    skipUpdate () {
      win.close()
    },
    remindLater () {
      win.close()
    }
  }
}
</script>
<style lang="stylus" scoped>
preloader = "data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%236c6c6c'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E"
@keyframes preloader-spin
  100%
    transform rotate(360deg)
section
  display flex
  background #ececec
  height 100vh
  padding 20px
  font-size 12px
  box-sizing border-box
aside
  width 70px
  margin-right 20px
  img
    width 100%
main
  flex 1
  display flex
  flex-direction column
  overflow hidden
  h4
    margin 0
    font-size 13px
  .loading
    display flex
    align-items center
    &::before
      content: ''
      size = 14px
      display inline-block
      width size
      height size
      margin-right 5px
      background url(preloader) no-repeat 50% / 100%
      animation preloader-spin .8s steps(12, end) infinite
  progress
    width 100%
    margin-bottom 12px
  textarea,
  [role="textbox"],
  [contenteditable="true"]
    flex .99
    position relative
    width 100%
    padding 5px
    margin-bottom 10px
    outline 0
    border 1px solid #888
    background #fff
    resize none
    overflow scroll
    -webkit-user-modify read-only
    box-sizing border-box
    &:empty::before
      content: ''
      size = 42px
      display inline-block
      width size
      height size
      position absolute
      top 0
      right 0
      bottom 0
      left 0
      margin auto
      background url(preloader) no-repeat 50% / 100%
      animation preloader-spin .8s steps(12, end) infinite
    >>>.markdown-body
      font-size 12px
      padding 10px
  label
    display flex
    align-items center
    margin-bottom 10px
    input[type="checkbox"]
      margin 0
    span
      margin 0 5px
      font-size 11px
  button
    -webkit-appearance none
    position relative
    padding 3px 10px
    border 0
    border-radius 6px
    background #fff
    outline 0
    box-shadow 0px 1px 1px rgba(0, 0, 0, .1)
    > span
      position relative
      z-index 1
    &::before
      content ''
      position absolute
      top 0
      left 0
      width 200%
      height 200%
      border 1px solid #c7c7c7
      border-radius inherit
      background inherit
      box-sizing border-box
      transform scale(0.5)
      transform-origin left top
    &.primary,
    &:active
      color #fff
      background linear-gradient(#6bb3fa, #015cff) bottom
      &::before
        border-color #4ca2f9
    &.primary
      &:active
        background linear-gradient(#4996fd, #003ddb) bottom
        &::before
          border-color #247eff
  .button-group
    display flex
    justify-content space-between
    .right button
      margin 0 5px
</style>
