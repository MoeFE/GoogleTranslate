<template>
  <section>
    <Header>
      <router-link class="close" type="button" slot="settings" :to="{ name: 'transition-page' }">关闭</router-link>
    </Header>
    <main>
      <header ref="header" style="transform: translateY(-40px)">
        <form action method="post" @submit.prevent>
          <div class="search-box">
            <input type="search" placeholder="搜索语言" v-model="language" @input="searchHandler">
          </div>
        </form>
      </header>
      <div class="languages" style="transform: translateY(40px)">
        <LanguageList v-if="!isSearch && false" title="最近使用">
          <LanguageItem country="zh-CN" active>中文（简体）</LanguageItem>
          <LanguageItem country="en-US">英语</LanguageItem>
        </LanguageList>
        <LanguageList ref="list" :title="isSearch ? `${Object.keys(country).length} 个语言` : '所有语言'">
          <LanguageItem 
            v-for="(value, key, index) in country" 
            :key="key" 
            :country="key" 
            :text="value" 
            :active="key === params.active.country" 
            @click.native="changeLanguageHandler(key, value, index)" 
          />
        </LanguageList>
      </div>
    </main>
  </section>
</template>
<script>
import anime from 'animejs'
import rawCountry from '../assets/json/languages.js'
import Header from '@/components/Header'
import LanguageList from '@/components/LanguageList'
import LanguageItem from '@/components/LanguageItem'
import { WindowHelper } from '../utils'
let country = { ...rawCountry }
export default {
  name: 'change-language-page',
  components: { Header, LanguageList, LanguageItem },
  data () {
    return {
      params: this.$route.params,
      country,
      language: '',
      view: {
        height: 530,
        animeOptions: { duration: 500, elasticity: 300 }
      }
    }
  },
  created () {
    if (this.params.from === 'target') delete country.auto
    else this.country = country = { ...rawCountry }
  },
  mounted () {
    WindowHelper.setSize(window.innerWidth, 530, this.view.animeOptions)
    anime({ targets: [this.$refs.header, '.languages'], translateY: 0, translateZ: 0 })
  },
  computed: {
    isSearch () {
      return Object.keys(this.country).length !== Object.keys(country).length
    }
  },
  methods: {
    searchHandler () {
      if (this.language) {
        const result = {}
        Object.entries(this.country).filter(x => x[1].includes(this.language)).forEach(x => (result[x[0]] = x[1]))
        this.country = result
        this.$nextTick(function () {
          const outerHeight = el => {
            const style = getComputedStyle(el)
            const height = el.offsetHeight
            const marginTop = Number.parseInt(style.marginTop)
            const marginBottom = Number.parseInt(style.marginBottom)
            return height + Number.parseInt(marginTop + marginBottom)
          }
          const headers = [...document.querySelectorAll('header')]
          const headerHeight = headers.map(x => outerHeight(x)).reduce((prev, next) => prev + next)
          const listHeight = this.$refs.list.$el.offsetHeight
          WindowHelper.setSize(window.innerWidth, headerHeight + listHeight + 19 + 5, this.view.animeOptions)
        })
      } else {
        this.country = country
        WindowHelper.setSize(window.innerWidth, this.view.height, this.view.animeOptions)
      }
    },
    changeLanguageHandler (country, value) {
      this.$router.push({ name: 'transition-page', params: { lang: { country, value: '' }, action: this.$route.params.from } })
    }
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
    width calc(100% - 2px)
    .search-box
      position relative
      padding 10px 20px
      &::before
        content '\e60d'
        font-family icon
        font-size 22px
        color #aaaeb3
        position absolute
        top 50%
        left 30px
        transform translate3d(0, -50%, 0)
      input[type="search"]
        appearance none
        outline 0
        border 0
        border-radius 6px
        font-size 16px
        font-weight 300
        width 100%
        padding 10px 20px 10px 40px
        box-shadow 0 1px .5px rgba(0, 0, 0, .1)
  .languages
    flex 1
    overflow scroll
    box-sizing border-box
</style>
