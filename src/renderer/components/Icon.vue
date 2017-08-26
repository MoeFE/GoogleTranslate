<template>
  <i :class="`icon icon-${icon}`" :style="{ transform: `rotate(${rotate}deg)` }"></i>
</template>
<script>
export default {
  name: 'icon',
  props: {
    icon: { type: String, required: true },
    rotate: { type: Number, required: false }
  }
}
</script>
