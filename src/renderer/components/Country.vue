<template>
  <img :src="src" draggable="false">
</template>
<script>
export default {
  name: 'country',
  props: {
    ssl: { type: Boolean, default: false, required: false },
    code: { type: String, default: 'auto', required: false },
    retina: { type: Boolean, default: true, required: false },
    local: { type: Boolean, default: true, required: false }
  },
  computed: {
    src () {
      if (this.local) return require(`../assets/img/${this.code}-2x.png`)
      else return `http://${this.ssl ? 'ssl-' : ''}api.itranslateapp.com/flags/${this.code}${this.retina ? '-2x' : ''}.png`
    }
  }
}
</script>
