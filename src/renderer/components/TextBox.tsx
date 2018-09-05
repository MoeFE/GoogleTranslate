import * as Vue from 'vue-tsx-support';
import Component from 'vue-class-component';
import { Prop, Watch, Inject } from 'vue-property-decorator';
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

export interface TextBoxProps {
  value?: string;
  placeholder?: string;
  readonly?: boolean;
}

export interface TextBoxEvents {
  onInput: string;
  onEnter: Event;
}

@Component
export default class TextBox extends Vue.Component<
  TextBoxProps,
  TextBoxEvents
> {
  public readonly $refs!: {
    tbox: HTMLTextAreaElement;
  };

  @Prop({ type: String, required: false })
  private readonly value!: string;

  private isComposition: boolean = false; // 是否正在输入法输入

  @Inject('handleResize')
  private readonly handleResize!: EventListenerOrEventListenerObject;

  @Watch('value', { immediate: true })
  private async handleChange() {
    await this.$nextTick();
    const { tbox } = this.$refs;
    if (this.value) tbox.focus();
    tbox.value = this.value;
    autosize.update(tbox);
  }

  private get text() {
    return this.value;
  }

  private set text(e: any) {
    // 等待输入法上屏后再更新值
    if (!this.isComposition) this.$emit('input', e.target.value);
  }

  private handleKeydown(e: KeyboardEvent) {
    // 禁止回车键
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      this.$emit('enter', e);
    }
  }

  private handleComposition(e: Event) {
    this.isComposition = e.type !== 'compositionend';
  }

  // eslint-disable-next-line class-methods-use-this
  private handleBlur(e: Event) {
    const evt = e as FocusEvent;
    if (evt.relatedTarget === null && evt.target) {
      (evt.target as HTMLTextAreaElement).focus();
    }
  }

  mounted() {
    const { tbox } = this.$refs;
    tbox.addEventListener('autosize:resized', this.handleResize);
    autosize(tbox);
  }

  beforeDestroy() {
    const { tbox } = this.$refs;
    tbox.removeEventListener('autosize:resized', this.handleResize);
    autosize.destroy(tbox);
  }

  render() {
    return (
      <TextArea
        ref="tbox"
        rows={1}
        v-model={this.text}
        onKeydown={this.handleKeydown}
        onCompositionstart={this.handleComposition}
        onCompositionupdate={this.handleComposition}
        onCompositionend={this.handleComposition}
        onBlur={this.handleBlur}
      />
    );
  }
}
