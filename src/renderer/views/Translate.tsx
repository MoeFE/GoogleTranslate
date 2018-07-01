import Vue from 'vue';
import Component from 'vue-class-component';
import { css } from 'vue-emotion';
import { Window, Main } from 'components/Layout';
import Header from 'components/Header';
import Icon from 'components/Icon';

const header = css`
  .icon-fixed {
    transform: rotate(-45deg);
  }
  .icon-settings:after {
    content: '\\e601';
    font-family: icon;
  }
`;

@Component
export default class Translate extends Vue {
  render() {
    return (
      <Window>
        <Header class={header}>
          <Icon type="fixed" slot="left" />
          <Icon type="settings" slot="right" />
        </Header>
        <Main />
      </Window>
    );
  }
}
