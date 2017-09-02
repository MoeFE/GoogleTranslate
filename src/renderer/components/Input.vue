<template>
  <input 
    :type="type" 
    :placeholder="placeholder" 
    :readonly="readonly" 
    :value="value" 
    @input="$emit('input', $event.target.value)"
    @compositionstart="isComposition = true" 
    @compositionupdate="isComposition = true" 
    @compositionend="isComposition = false"
  >
</template>
<script>
export default {
  name: 'input',
  props: {
    type: { type: String, default: 'text', required: false },
    value: { type: String, default: '', required: true },
    placeholder: { type: String, default: '', required: false },
    readonly: { type: Boolean, default: false, required: false }
  },
  data () {
    return {
      isComposition: false
    }
  }
}
</script>
<style lang="stylus" scoped>
input
  appearance none
  outline 0
  border 0
  border-radius 6px
  font-size 16px
  font-weight 300
  width 100%
  padding 10px 20px
  box-shadow 0 1px .5px rgba(0, 0, 0, .1)
</style>
