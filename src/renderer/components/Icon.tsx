import * as Vue from 'vue-tsx-support';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import styled from 'vue-emotion';

const Ico = styled.i`
  display: inline-block;
`;

export interface IconProps {
  type: string;
  rotate?: number;
  tabindex?: number;
  disabled?: boolean;
}

export interface IconEvents {
  onClick?: (e: Event) => void;
  onFocus?: (e: Event) => void;
}

@Component
export default class Icon extends Vue.Component<IconProps, IconEvents> {
  @Prop({ type: String, required: true })
  private readonly type!: string;

  @Prop({ type: Number, required: false })
  private readonly rotate!: number;

  private handleClick(e: Event) {
    this.$emit('click', e);
  }

  private handleFocus(e: Event) {
    this.$emit('focus', e);
  }

  render() {
    const { type, rotate } = this;

    return (
      <Ico
        class={`icon icon-${type}`}
        style={{ transform: `rotate(${rotate}deg)` }}
        onClick={this.handleClick}
        onFocus={this.handleFocus}
      />
    );
  }
}
