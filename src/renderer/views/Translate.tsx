/* eslint-disable no-nested-ternary */
import { remote } from 'electron';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch, Provide } from 'vue-property-decorator';
import styled, { css } from 'vue-emotion';
import anime from 'animejs';
import Layout, { Main } from 'components/Layout';
import Header from 'components/Header';
import Icon from 'components/Icon';
import Language from 'components/Language';
import Tools from 'utils/tools';
import * as tjs from 'translation.js';

const { Menu, MenuItem } = remote;
const errMsg: any = {
  NETWORK_ERROR: '网络繁忙，请稍后再试',
  API_SERVER_ERROR: '翻译错误',
  UNSUPPORTED_LANG: '当前引擎不支持翻译该语种',
  NETWORK_TIMEOUT: '翻译超时',
};

// #region stylesheet
const header = css`
  .icon-fixed {
    transform: rotate(-45deg);
  }
  .icon-settings:after {
    content: '\\e601';
    font-family: icon;
  }
`;

const Form = styled.form`
  flex: 1;
  margin: 9px 0;
  width: 100%;
  overflow: hidden;
  scroll-behavior: smooth;
`;

const Divider = styled.div`
  position: relative;
  text-align: center;
  color: #ccc;
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%) scaleY(0.5);
    width: 100%;
    height: 1px;
    background: #eee;
  }
`;

const Switch = styled(Icon)`
  display: inline-block;
  position: relative;
  z-index: 1;
  padding: 0 5px;
  font-size: 20px;
  font-weight: bold;
  background: #fff;
  &:not([disabled]):active {
    color: #3e83f8;
  }
`;
// #endregion

@Component
export default class Translate extends Vue {
  public readonly $refs!: {
    form: HTMLFormElement;
    slang: Language;
    switch: Vue;
  };

  private keymap = {
    'meta+,': () => {},
    'meta+s': this.handleSwitch,
    'meta+v': this.handlePaste,
    'meta+shift+1': () => {},
    'meta+shift+2': () => {},
    'meta+1': () => {},
    'meta+2': () => {},
    'meta+ctrl+1': () => {},
    'meta+ctrl+2': () => {},
    'meta+ctrl+3': () => {},
    'meta+ctrl+4': () => {},
    'meta+q': () => remote.app.quit(),
  };

  private readonly audio = new Audio();

  private source = {
    key: 'zh-CN',
    country: 'zh-CN',
    value: '',
    loading: false,
    error: false,
  };

  private target = {
    key: 'en',
    country: 'en-UK',
    value: '',
    loading: false,
    error: false,
  };

  @Provide('handleResize')
  private async handleResize() {
    const { form } = this.$refs;
    const formHeight = [...form.children]
      .map(el => el.clientHeight)
      .reduce((prev, next) => prev + next);
    const innerHeight = 190 + (formHeight + 18) - 129; // eslint-disable-line no-mixed-operators
    if (innerHeight !== window.innerHeight) {
      form.scrollTop = 0; // 滚动条位置始终设置为0，防止视觉抖动
      Tools.resize(window.innerWidth, innerHeight);
    }
  }

  @Watch('source.value')
  private handleChangeSource() {
    this.target.value = '';
    this.target.error = false;
    this.target.loading = false;
    this.$refs.slang.tbox.focus();
  }

  // eslint-disable-next-line class-methods-use-this
  private handleClickFixed() {
    // remote.getCurrentWindow().setAlwaysOnTop()
  }

  private handleClickSetting() {
    const menu = new Menu();
    menu.append(
      new MenuItem({
        label: '偏好设置',
        accelerator: 'Cmd+,',
        click: () => {},
      }),
    );
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(
      new MenuItem({
        label: '切换语言',
        accelerator: 'Cmd+S',
        enabled: this.source.country !== 'auto',
        click: () => this.switch(),
      }),
    );
    menu.append(
      new MenuItem({
        label: '更改源语言',
        accelerator: 'Shift+Cmd+1',
        click: () => {},
      }),
    );
    menu.append(
      new MenuItem({
        label: '更改目标语言',
        accelerator: 'Shift+Cmd+2',
        click: () => {},
      }),
    );
    menu.append(
      new MenuItem({
        label: '说源语言',
        accelerator: 'Cmd+1',
        enabled: !!this.source.value && this.source.country !== 'auto',
        click: () => {},
      }),
    );
    menu.append(
      new MenuItem({
        label: '说目标语言',
        accelerator: 'Cmd+2',
        enabled: !!this.target.value,
        click: () => {},
      }),
    );
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(
      new MenuItem({
        label: '使用百度翻译',
        accelerator: 'Ctrl+Cmd+1',
        enabled: !!this.source.value,
        click: () => {},
      }),
    );
    menu.append(
      new MenuItem({
        label: '使用有道翻译',
        accelerator: 'Ctrl+Cmd+2',
        enabled: !!this.source.value,
        click: () => {},
      }),
    );
    menu.append(
      new MenuItem({
        label: '使用谷歌翻译',
        accelerator: 'Ctrl+Cmd+3',
        enabled: !!this.source.value,
        click: () => {},
      }),
    );
    menu.append(
      new MenuItem({
        label: '使用谷歌（国内）',
        accelerator: 'Ctrl+Cmd+4',
        enabled: !!this.source.value,
        click: () => {},
      }),
    );
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(
      new MenuItem({
        label: '退出 Google 翻译',
        accelerator: 'Cmd+Q',
        click: remote.app.quit,
      }),
    );
    menu.popup({
      window: remote.getCurrentWindow(),
    });
  }

  private async handleSwitch(e: MouseEvent | string) {
    await this.$nextTick();
    const isInput = typeof e === 'string';
    if (!isInput || this.target.value) {
      this.switch(!isInput);
    }
  }

  private async handlePaste() {
    const { value } = this.source;
    await Tools.eventLoop(() => value !== this.source.value);
    this.translate();
  }

  private handleTranslate() {
    this.translate();
  }

  public switch(translate: boolean = true) {
    [this.source, this.target] = [this.target, this.source];
    this.$refs.slang.tbox.focus();
    this.target.value = '';
    if (translate) this.translate();
    anime({
      targets: this.$refs.switch.$el,
      rotate: ['0deg', '180deg'],
    });
  }

  public async translate(
    engine: 'baidu' | 'google' | 'youdao' = 'google',
    com: boolean = false,
  ) {
    try {
      const { key: sourceLang, value } = this.source;
      const { key: targetLang } = this.target;
      if (value) {
        const lang = await tjs.google.detect({ text: value, com });

        // eslint-disable-next-line max-len
        const swap = lang !== sourceLang && [sourceLang, targetLang].includes(lang); // prettier-ignore
        const auto = swap || sourceLang === 'auto';
        const googl = tjs[engine] as typeof tjs.google;
        this.target.loading = true;
        await Tools.sleep(200);
        const { text, result, dict } = await googl.translate({
          text: value,
          from: auto ? lang : sourceLang,
          to: swap ? sourceLang : targetLang,
          com,
        });

        this.target.error = false;
        if (swap) {
          [this.source.key, this.target.key] = [
            this.target.key,
            this.source.key,
          ];
          [this.source.country, this.target.country] = [
            this.target.country,
            this.source.country,
          ];
        }
        if (value === text) {
          const hasResult = Array.isArray(result) && result.length > 0;
          this.target.value = (hasResult ? (result as any)[0] : text) || value;
        }
      }
    } catch ({ code, message }) {
      this.target.error = true;
      this.target.value = navigator.onLine
        ? code
          ? errMsg[code]
          : message
        : '网络连接已中断';
    } finally {
      this.target.loading = false;
      await Tools.sleep();
      this.$refs.slang.tbox.focus();
    }
  }

  activated() {
    Tools.resize(window.innerWidth, 190);
    anime({
      targets: 'form',
      translateY: [-40, 0],
      translateZ: 0,
    });
  }

  render() {
    return (
      <Layout v-hotkey={this.keymap}>
        <Header class={header}>
          <Icon type="fixed" slot="left" onClick={this.handleClickFixed} />
          <Icon
            type="settings"
            slot="right"
            onClick={this.handleClickSetting}
          />
        </Header>
        <Main style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Form ref="form">
            <Language
              ref="slang"
              v-model={this.source.value}
              country={this.source.country}
              loading={this.source.loading}
              onEnter={this.handleTranslate}
              allowClear
            />
            <Divider>
              <Switch
                ref="switch"
                type="switch"
                nativeOnClick={this.handleSwitch}
              />
            </Divider>
            <Language
              v-model={this.target.value}
              country={this.target.country}
              loading={this.target.loading}
              error={this.target.error}
              readOnly={this.source.country === 'auto'}
              onInput={this.handleSwitch}
              onEnter={this.handleSwitch}
            />
          </Form>
        </Main>
      </Layout>
    );
  }
}
