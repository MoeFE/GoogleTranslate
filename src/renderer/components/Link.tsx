import { remote } from 'electron';

import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import styled from 'vue-emotion';

const A = styled.a`
  color: #008cff;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
`;

@Component
export default class Link extends Vue {
  @Prop({ type: String, required: false, default: 'javascript:;' }) // eslint-disable-line no-script-url
  private readonly href!: string;

  private handleClick(e: Event) {
    e.preventDefault();
    remote.shell.openExternal(this.href);
  }

  render() {
    return (
      <A href={this.href} onClick={this.handleClick}>
        {this.$slots.default}
      </A>
    );
  }
}
