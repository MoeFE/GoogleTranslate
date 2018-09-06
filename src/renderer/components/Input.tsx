import * as Vue from 'vue-tsx-support';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { css } from 'vue-emotion';

export interface InputProps {
  value?: string;
  type?: string;
  placeholder?: string;
  autofocus?: boolean;
}

export interface InputEvents {
  onInput: string;
  onEnter: KeyboardEvent;
  onBlur: FocusEvent;
}

@Component
export default class Input extends Vue.Component<InputProps, InputEvents> {
  @Prop({ type: String, required: false, default: '' })
  private readonly value!: string;

  private isComposition: boolean = false;

  private get text(): string {
    return this.value;
  }

  private set text(value: string) {
    if (!this.isComposition) this.$emit('input', value);
  }

  private handleKeydown(e: KeyboardEvent) {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.$emit('enter', e);
    }
  }

  private handleBlur(e: FocusEvent) {
    this.$emit('blur', e);
  }

  private handleComposition(e: CompositionEvent) {
    this.isComposition = e.type !== 'compositionend';
  }

  render() {
    return (
      <input
        class={css`
          appearance: none;
          outline: 0;
          border: 0;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 300;
          width: 100%;
          padding: 10px 20px;
          box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.1);
          box-sizing: border-box;
        `}
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
