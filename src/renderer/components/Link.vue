<template>
  <a :href="href" @click.prevent="openExternal">
    <slot />
  </a>
</template>
<script>
const shell = require('electron').shell
export default {
  name: 'link',
  props: {
    href: { type: String, default: 'javascript:;', required: false },
    external: { type: Boolean, default: true, required: false }
  },
  methods: {
    openExternal () {
      if (this.external) shell.openExternal(this.href)
    }
  }
}
</script>
<style lang="stylus" scoped>
a
  color #008cff
  text-decoration none
  font-weight 500
</style>
