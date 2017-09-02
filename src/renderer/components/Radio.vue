<template>
  <label class="radio-box">
    <input :name="name" type="radio" :value="value" v-model="model">
    <span class="radio"></span>
    <span><slot /></span>
  </label>
</template>
<script>
export default {
  name: 'radio',
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    name: { type: String, default: '', required: false },
    value: { type: String, default: '', required: false },
    checked: { type: String, default: '', required: false }
  },
  computed: {
    model: {
      get () { return this.checked },
      set (value) { this.$emit('change', value) }
    }
  }
}
</script>
<style lang="stylus" scoped>
size = 14px
.radio-box
  display inline-flex
  justify-content center
  align-items center
  &:not(:nth-last-of-type(1))
    margin-right 10px
  input[type="radio"]
    display none
    &:checked + .radio
      background #3497ff
      border-color transparent
      &::before
        transform scale(1)
  .radio
    display flex
    justify-content center
    align-items  center
    position relative
    width size
    height size
    border 1px solid #cdcdcd
    border-radius size
    background #fff
    margin-right 5px
    box-sizing border-box
    box-shadow 0 1px 1px rgba(0, 0, 0, .1) inset
    &::before
      content: ''
      display inline-block
      position absolute
      offset = 10px
      width size - offset
      height size - offset
      border-radius size - offset
      background #fff
      box-shadow 1px 1px 1px rgba(0, 0, 0, .1)
      transition .1s ease-in-out
      transform scale(0)
</style>
