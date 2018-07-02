import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import styled from 'vue-emotion';
import autosize from 'autosize';

const TextArea = styled.textarea`
  -webkit-appearance: none;
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
  overflow-y: scroll;
  word-break: break-all;
  user-select: text;
  &::-webkit-scrollbar {
    display: none;
  }
  &::-webkit-input-placeholder {
    color: #ccc;
  }
  &:empty:before {
    content: attr(placeholder);
    position: absolute;
    color: #ccc;
  }
  &.error {
    color: #ff2600;
  }
`;

@Component
export default class TextBox extends Vue {
  @Prop({ type: String, required: false })
  private readonly value!: string;

  @Watch('value', { immediate: true })
  private async handleChange() {
    await this.$nextTick();
    const tbox = this.$refs.tbox as HTMLTextAreaElement;
    if (tbox.value !== this.value) {
      tbox.value = this.value;
      autosize.update(tbox);
    }
  }

  private handleInput(e: any) {
    this.$emit('input', e.target.value);
  }

  mounted() {
    autosize(this.$refs.tbox as HTMLTextAreaElement);
  }

  render() {
    return (
      <TextArea
        ref="tbox"
        rows={1}
        value={this.value}
        onInput={this.handleInput}
      />
    );
  }
}
