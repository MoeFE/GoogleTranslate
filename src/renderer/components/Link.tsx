import { remote } from 'electron';

import * as Vue from 'vue-tsx-support';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { css } from 'vue-emotion';

export interface LinkProps {
  href?: string;
}

@Component
export default class Link extends Vue.Component<LinkProps> {
  @Prop({ type: String, required: false, default: 'javascript:;' }) // eslint-disable-line no-script-url
  private readonly href!: string;

  private handleClick(e: Event) {
    e.preventDefault();
    remote.shell.openExternal(this.href);
  }

  render() {
    return (
      <a
        class={css`
          color: #008cff;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
        `}
        href={this.href}
        onClick={this.handleClick}
      >
        {this.$slots.default}
      </a>
    );
  }
}
