import { ipcRenderer } from 'electron';

import Vue from 'vue';
import Comopnent from 'vue-class-component';
import { injectGlobal } from 'vue-emotion';
import LocaleProvider from 'components/LocaleProvider';

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  * {
    backface-visibility: hidden;
    box-sizing: border-box;
  }
  html,
  body,
  #app {
    height: 100%;
  }
  html {
    -webkit-font-smoothing: antialiased;
    -webkit-user-drag: none;
    user-select: none;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Ubuntu,
      Helvetica Neue, sans-serif;
    font-weight: 300;
    cursor: default;
  }
  body {
    margin: 0;
    overflow: hidden;
  }
  #app {
    &:before {
      content: '\\e601';
      display: block;
      color: #4286f5;
      font-family: icon;
      font-size: 32px;
      text-align: center;
      line-height: 0.3;
      transform: rotate(180deg);
    }
  }
`;

@Comopnent
export default class App extends Vue {
  private keymap = {
    esc: this.handleEscape,
  };

  private handleEscape() {
    if (this.$route.name === 'translate') {
      ipcRenderer.send('hideWindow');
    } else {
      this.$router.push('/');
    }
  }

  created() {
    document.addEventListener('mouseenter', () => {
      window.focus();
    });
  }

  render() {
    return (
      <LocaleProvider locale="zh-CN" v-hotkey={this.keymap}>
        <keep-alive exclude={['Language']}>
          <router-view />
        </keep-alive>
      </LocaleProvider>
    );
  }
}
