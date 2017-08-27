<template>
  <section>
    <Header>
      <router-link class="close" type="button" slot="settings" :to="{ name: 'translate-page' }">关闭</router-link>
    </Header>
    <main>
      <header>
        <center>
          <p>Header</p>
        </center>
      </header>
      <div class="languages">
        <LanguageList title="最近使用">
          <LanguageItem country="zh-CN" active>中文（简体）</LanguageItem>
          <LanguageItem country="en-US">英语</LanguageItem>
        </LanguageList>
        <LanguageList title="所有语言">
          <LanguageItem v-for="(value, key, index) in country" :key="index" :country="key">{{ value }}</LanguageItem>
        </LanguageList>
      </div>
    </main>
  </section>
</template>
<script>
import country from '../assets/json/languages.js'
import Header from '@/components/Header'
import LanguageList from '@/components/LanguageList'
import LanguageItem from '@/components/LanguageItem'
export default {
  name: 'change-language-page',
  components: { Header, LanguageList, LanguageItem },
  data () {
    return {
      country
    }
  },
  beforeCreate () {
    window.resizeTo(400, 520)
  }
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
  > header
    background #f7fafb
    border-bottom 1px solid #d7dce0
    margin-bottom 10px
  .languages
    overflow scroll
    height 100%
    box-sizing border-box
</style>
