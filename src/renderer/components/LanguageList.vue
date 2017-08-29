<template>
  <div class="language-list">
    <h4>{{ title }}</h4>
    <ul>
      <slot />
    </ul>
  </div>
</template>
<script>
export default {
  name: 'language-list',
  props: {
    title: { type: String, default: '标题', required: true }
  }
}
</script>
<style lang="stylus" scoped>
h4
  color #b1b9c0
  margin 0 8px
  padding 0 15px
  font-size 16.5px
ul
  margin 5px 0
  padding 0
  list-style none
  font-weight 500
  &:empty::before
    content: ''
    display block
    height 10px
</style>
