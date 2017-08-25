<template>
  <i :class="`icon icon-${icon}`"></i>
</template>
<script>
export default {
  name: 'icon',
  props: {
    icon: { type: String, required: true }
  }
}
</script>
