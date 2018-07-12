import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { css } from 'vue-emotion';

const input = css`
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
`;

@Component
export default class Input extends Vue {
  @Prop({ type: String, required: false, default: '' })
  private readonly value!: string;

  private isComposition: boolean = false;

  private get text(): string {
    return this.value;
  }

  private set text(value: string) {
    if (!this.isComposition) this.$emit('input', value);
  }

  private handleKeydown(e: Event) {
    // 禁止回车键
    if ((e as KeyboardEvent).keyCode === 13) {
      e.preventDefault();
      this.$emit('enter', e);
    }
  }

  private handleComposition(e: Event) {
    this.isComposition = e.type !== 'compositionend';
  }

  render() {
    return (
      <input
        class={input}
        v-model={this.text}
        onKeydown={this.handleKeydown}
        onCompositionstart={this.handleComposition}
        onCompositionupdate={this.handleComposition}
        onCompositionend={this.handleComposition}
      />
    );
  }
}
