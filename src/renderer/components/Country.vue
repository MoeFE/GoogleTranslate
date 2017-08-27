<template>
  <img :src="`http://${ssl ? 'ssl-' : ''}api.itranslateapp.com/flags/${code}${retina ? '-2x' : ''}.png`">
</template>
<script>
export default {
  name: 'country',
  props: {
    ssl: { type: Boolean, default: false, required: false },
    code: { type: String, default: 'auto', required: false },
    retina: { type: Boolean, default: true, required: false }
  }
}
</script>
