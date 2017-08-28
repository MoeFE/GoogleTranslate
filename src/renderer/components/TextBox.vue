<template>
  <div 
    ref="text" 
    role="textbox" 
    contenteditable="true" 
    :placeholder="placeholder" 
    @input="updateValue"
    @compositionstart="isComposition = true" 
    @compositionupdate="isComposition = true" 
    @compositionend="isComposition = false"
  ></div>
</template>
<script>
export default {
  name: 'textbox',
  props: {
    value: { type: String, default: '', required: true },
    placeholder: { type: String, default: '', required: false }
  },
  data () {
    return {
      isComposition: false
    }
  },
  watch: {
    value () {
      if (!this.isComposition) {
        this.$refs.text.innerText = this.value
        if (this.value) document.getSelection().setPosition(this.$refs.text, 1)
      } else this.$refs.text.focus()
    }
  },
  methods: {
    updateValue () {
      this.$emit('input', event.target.innerText)
    }
  }
}
</script>

<style lang="stylus" scoped>
input,
textarea,
div[role="text"],
div[role="textbox"]
  appearance none
  display block
  flex 1
  align-self center
  outline 0
  border 0
  border-radius 0
  margin 5px 0
  padding 0
  font-size 22px
  font-weight 300
  resize none
  min-height 26px
  max-height 300px
  overflow scroll
  &:empty::before
    content attr(placeholder)
    position absolute
    color #ccc
</style>
