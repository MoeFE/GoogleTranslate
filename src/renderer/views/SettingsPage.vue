<template>
  <Layout @close="view.animationEnd && $router.push('/')">
    <div class="container">
      <main>
        <div class="pannel">
          <h3 class="title">自动开始</h3>
          <div class="body">
            <p>启动 Mac 时自动启动 Google Translate</p>
          </div>
        </div>
        <div class="pannel">
          <h3 class="title">定义快捷键</h3>
          <div class="body">
            <p>Google Translate 触手可及。使用此快捷键打开：</p>
          </div>
        </div>
      </main>
      <footer>
        <p><a class="link" href="https://github.com/MoeFE/GoogleTranslate">Google Translate</a></p>
        <p class="help">1.0.0</p>
      </footer>
    </div>
  </Layout>
</template>
<script>
import anime from 'animejs'
import Layout from '@/views/_Layout'
import { WindowHelper } from '../utils'
export default {
  name: 'settings-page',
  components: { Layout },
  data () {
    return {
      view: {
        height: 660,
        animeOptions: { duration: 150, easing: 'easeOutQuart' },
        animationEnd: false
      }
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
  padding 20px
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
    p
      margin 0
.container
  display flex
  flex-direction column
  height 100vh
  padding 20px
  box-sizing border-box
  font-size 14px
  main
    flex 1
    margin-bottom 20px
  footer
    text-align center
    p
      margin 5px 0
      &:nth-last-of-type(1)
        margin 0
  .link
    color #008cff
    text-decoration none
    font-weight 500
  .help
    color #9ca3a9
    font-size 12px
</style>
