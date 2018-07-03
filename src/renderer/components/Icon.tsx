import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class Icon extends Vue {
  @Prop({ type: String, required: true })
  private readonly type!: string;

  @Prop({ type: String, required: false })
  private readonly rotate!: string;

  private handleClick(e: Event) {
    this.$emit('click', e);
  }

  render() {
    const { type, rotate } = this;

    return (
      <i
        class={`icon icon-${type}`}
        style={{ transform: `rotate(${rotate}deg)` }}
        onClick={this.handleClick}
      />
    );
  }
}
