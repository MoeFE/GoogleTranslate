<template>
  <div 
    ref="input" 
    role="textbox" 
    contenteditable="true" 
    :placeholder="placeholder" 
    :class="classNames"
    :style="style" 
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
    placeholder: { type: String, default: '', required: false },
    readonly: { type: Boolean, default: false, required: false },
    error: { type: Boolean, default: false, required: false }
  },
  data () {
    return {
      selectionStart: 0,
      isComposition: false
    }
  },
  computed: {
    style () {
      return { userModify: this.readonly ? 'read-only' : 'read-write-plaintext-only' }
    },
    classNames () {
      return { error: this.error }
    }
  },
  watch: {
    value: {
      immediate: true,
      async handler (newVal) {
        await this.$nextTick()
        if (this.$refs.input) {
          if (!this.isComposition) {
            if (this.$refs.input.innerText !== newVal) {
              this.$refs.input.innerText = newVal
            }
          } else this.$refs.input.focus()
        }
      }
    }
  },
  methods: {
    updateValue () {
      this.$emit('input', event.target.innerText)
    }
  },
  created () {
    document.addEventListener('selectionchange', () => (this.selectionStart = document.getSelection().focusOffset))
  }
}
</script>

<style lang="stylus" scoped>
input, textarea, div[role='text'], div[role='textbox'] {
  appearance: none;
  display: block;
  flex: 1;
  align-self: center;
  outline: 0;
  border: 0;
  border-radius: 0;
  margin: 5px 0;
  padding: 0;
  color: #333;
  font-size: 22px;
  font-weight: 300;
  resize: none;
  min-height: 26px;
  max-height: 300px;
  overflow-y: scroll; // overflow-x 在部分机型上会产生高度 导致输入框变高造成不对齐（wqnmlgb）
  word-break: break-all;
  user-select: text;

  &::-webkit-scrollbar { // 在部分机型上会产生滚动条 所以隐藏掉 不影响滚动功能
    display: none;
  }

  &:empty::before {
    content: attr(placeholder);
    position: absolute;
    color: #ccc;
  }

  &.error {
    color: #ff2600;
  }
}
</style>
