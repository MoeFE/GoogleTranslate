import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import styled from 'vue-emotion';

const Ico = styled.i`
  display: inline-block;
`;

@Component
export default class Icon extends Vue {
  @Prop({ type: String, required: true })
  private readonly type!: string;

  @Prop({ type: Number, required: false })
  private readonly rotate!: string;

  private handleClick(e: Event) {
    this.$emit('click', e);
  }

  render() {
    const { type, rotate } = this;

    return (
      <Ico
        class={`icon icon-${type}`}
        style={{ transform: `rotate(${rotate}deg)` }}
        onClick={this.handleClick}
      />
    );
  }
}
