/* eslint-disable no-nested-ternary */
import { remote } from 'electron';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch, Provide } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';
import styled, { css } from 'vue-emotion';
import anime from 'animejs';
import * as tjs from 'translation.js';
import Layout, { Main } from 'components/Layout';
import Header from 'components/Header';
import Icon from 'components/Icon';
import Language from 'components/Language';
import Progress, { Spin } from 'components/Progress';
import Tools from 'utils/tools';
import { IState, ILang } from '../store';

const { app, Menu, MenuItem } = remote;
const currentWindow = remote.getCurrentWindow();
const errMsg: any = {
  NETWORK_ERROR: '网络繁忙，请稍后再试',
  API_SERVER_ERROR: '翻译错误',
  UNSUPPORTED_LANG: '当前引擎不支持翻译该语种',
  NETWORK_TIMEOUT: '翻译超时',
};

// #region stylesheet
const header = css`
  .icon-fixed {
    transform: rotate(0deg);
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
    'meta+shift+1': () => this.changeLanguage('source'),
    'meta+shift+2': () => this.changeLanguage('target'),
    'meta+1': () => this.speak('source'),
    'meta+2': () => this.speak('target'),
    'meta+ctrl+1': () => this.translate('baidu'),
    'meta+ctrl+2': () => this.translate('youdao'),
    'meta+ctrl+3': () => this.translate('google', true),
    'meta+ctrl+4': () => this.translate('google'),
    'meta+q': () => app.quit(),
  };

  @State('isAlwaysOnTop') private readonly isAlwaysOnTop!: boolean;
  @State('sourceLang') private readonly sourceLang!: ILang;
  @State('targetLang') private readonly targetLang!: ILang;
  @Mutation('save') private readonly setState!: (payload: IState) => void;

  private readonly audio = new Audio();

  private source = {
    key: 'zh-CN',
    country: 'zh-CN',
    value: '',
    progress: 0,
    action: true,
    loading: false,
    error: false,
  };

  private target = {
    key: 'en',
    country: 'en-UK',
    value: '',
    progress: 0,
    action: true,
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
    if (innerHeight >= 190 && innerHeight !== window.innerHeight) {
      form.scrollTop = 0; // 滚动条位置始终设置为0，防止视觉抖动
      Tools.resize(window.innerWidth, innerHeight);
    }
  }

  @Watch('source.value')
  private handleChangeSource() {
    this.source.action = true;
    this.target.value = '';
    this.target.error = false;
    this.target.loading = false;
    this.$refs.slang.tbox.focus();
  }

  @Watch('target.value')
  private handleChangeTarget() {
    this.target.action = true;
  }

  @Watch('source.key')
  @Watch('source.country')
  @Watch('target.key')
  @Watch('target.country')
  private handleChangeLangs() {
    this.setState({
      sourceLang: { key: this.source.key, country: this.source.country },
      targetLang: { key: this.target.key, country: this.target.country },
    });
  }

  private handleClickFixed() {
    const isAlwaysOnTop = !currentWindow.isAlwaysOnTop();
    this.setState({ isAlwaysOnTop });
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
        click: () => this.changeLanguage('source'),
      }),
    );
    menu.append(
      new MenuItem({
        label: '更改目标语言',
        accelerator: 'Shift+Cmd+2',
        click: () => this.changeLanguage('target'),
      }),
    );
    menu.append(
      new MenuItem({
        label: '说源语言',
        accelerator: 'Cmd+1',
        enabled: !!this.source.value && this.source.country !== 'auto',
        click: () => this.speak('source'),
      }),
    );
    menu.append(
      new MenuItem({
        label: '说目标语言',
        accelerator: 'Cmd+2',
        enabled: !!this.target.value,
        click: () => this.speak('target'),
      }),
    );
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(
      new MenuItem({
        label: '使用百度翻译',
        accelerator: 'Ctrl+Cmd+1',
        enabled: !!this.source.value,
        click: () => this.translate('baidu'),
      }),
    );
    menu.append(
      new MenuItem({
        label: '使用有道翻译',
        accelerator: 'Ctrl+Cmd+2',
        enabled: !!this.source.value,
        click: () => this.translate('youdao'),
      }),
    );
    menu.append(
      new MenuItem({
        label: '使用谷歌翻译',
        accelerator: 'Ctrl+Cmd+3',
        enabled: !!this.source.value,
        click: () => this.translate('google', true),
      }),
    );
    menu.append(
      new MenuItem({
        label: '使用谷歌（国内）',
        accelerator: 'Ctrl+Cmd+4',
        enabled: !!this.source.value,
        click: () => this.translate('google'),
      }),
    );
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(
      new MenuItem({
        label: '退出 Google 翻译',
        accelerator: 'Cmd+Q',
        click: app.quit,
      }),
    );
    menu.popup({ window: currentWindow });
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

  private handlePause() {
    this.audio.pause();
  }

  private handleTranslate() {
    if (!this.target.value) {
      this.translate();
    }
  }

  private changeLanguage(type: 'source' | 'target') {
    const { key, country } = this[type];
    this.$router.push({
      name: 'language',
      query: {
        type,
        key,
        country,
      },
    });
  }

  public async switch(translate: boolean = true) {
    if (this.source.key === 'auto') return;
    [this.source, this.target] = [this.target, this.source];
    this.$refs.slang.tbox.focus();
    this.target.value = '';
    await this.$nextTick();
    if (translate) this.translate();
    anime({
      targets: this.$refs.switch.$el,
      rotate: ['0deg', '180deg'],
    });
  }

  public async speak(type: 'source' | 'target') {
    const { value: text, key: from } = this[type];
    if (text) {
      this[type].action = false;
      const uri = await tjs.google.audio({ text, from, com: true });
      await Tools.sleep(600);
      if (text === this[type].value) {
        this.audio.src = uri;
        this.audio.play();
        this.audio.onloadedmetadata = () => {
          const animeInstance = anime({
            targets: this[type],
            progress: 1,
            duration: this.audio.duration * 1e3,
            easing: 'linear',
            update: () => {
              if (this.audio.paused) {
                animeInstance.pause();
                this[type].progress = 0;
                this[type].action = true;
              }
            },
            complete: () => {
              this[type].progress = 0;
              this[type].action = true;
            },
          });
        };
      } else {
        this[type].action = true;
      }
    }
  }

  public async translate(
    engine: 'baidu' | 'google' | 'youdao' = 'google',
    com: boolean = true,
  ) {
    try {
      const { key: sourceLang, value } = this.source;
      const { key: targetLang } = this.target;
      if (value) {
        this.target.loading = true;
        const lang = await tjs.google.detect({ text: value, com });

        // eslint-disable-next-line max-len
        const swap = sourceLang !== 'auto' && lang !== sourceLang && [sourceLang, targetLang].includes(lang); // prettier-ignore
        const auto = swap || sourceLang === 'auto';
        const googl = tjs[engine] as typeof tjs.google;
        await Tools.sleep(200);
        let {
          text, // eslint-disable-line prefer-const
          raw, // eslint-disable-line prefer-const
          dict, // eslint-disable-line prefer-const
          result,
        } = await googl.translate({
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
          if (engine === 'google') {
            result = raw.sentences.map(({ trans }: any) => trans);
          }
          const hasResult = Array.isArray(result) && result.length > 0;
          this.target.value = (hasResult ? (result as string[]).join('') : text) || value; // prettier-ignore
        }
      }
    } catch ({ code, message }) {
      this.target.error = true;
      this.target.value = navigator.onLine
        ? code
          ? errMsg[code]
          : message
        : '您需要连接互联网才能使用 Google 翻译';
    } finally {
      this.target.loading = false;
      await Tools.sleep();
      this.$refs.slang.tbox.focus();
    }
  }

  created() {
    Object.assign(this.source, this.sourceLang);
    Object.assign(this.target, this.targetLang);
  }

  async activated() {
    Tools.resize(window.innerWidth, 190);
    anime({
      targets: 'form',
      translateY: [-40, 0],
      translateZ: 0,
    });
    this.$refs.slang.tbox.focus();
    const { key, country } = this.$route.query;
    const type = this.$route.query.type as 'source' | 'target' | null;
    if (type && key && country) {
      this[type].key = key;
      this[type].country = country;
    }
    await this.$nextTick();
    this.translate();
  }

  render() {
    return (
      <Layout v-hotkey={this.keymap}>
        <Header class={header}>
          <Icon
            slot="left"
            type="fixed"
            rotate={this.isAlwaysOnTop ? 0 : -45}
            onClick={this.handleClickFixed}
          />
          <Icon
            slot="right"
            type="settings"
            onClick={this.handleClickSetting}
          />
        </Header>
        <Main>
          <Form ref="form">
            <Language
              ref="slang"
              v-model={this.source.value}
              country={this.source.country}
              action={this.source.action}
              loading={this.source.loading}
              onClick={() => this.changeLanguage('source')}
              onEnter={this.handleTranslate}
              onSpeak={() => this.speak('source')}
              allowClear
            >
              {this.source.progress > 0 ? (
                <Progress
                  slot="progress"
                  value={this.source.progress}
                  onPause={this.handlePause}
                />
              ) : !this.source.action ? (
                <Spin slot="progress" />
              ) : null}
            </Language>
            <Divider>
              <Switch
                ref="switch"
                type="switch"
                nativeOnClick={this.handleSwitch}
                disabled={this.source.key === 'auto'}
              />
            </Divider>
            <Language
              v-model={this.target.value}
              country={this.target.country}
              action={this.target.action}
              loading={this.target.loading}
              error={this.target.error}
              readOnly={this.source.country === 'auto'}
              onClick={() => this.changeLanguage('target')}
              onInput={this.handleSwitch}
              onEnter={this.handleSwitch}
              onSpeak={() => this.speak('target')}
            >
              {this.target.progress > 0 ? (
                <Progress
                  slot="progress"
                  value={this.target.progress}
                  onPause={this.handlePause}
                />
              ) : !this.target.action ? (
                <Spin slot="progress" />
              ) : null}
            </Language>
          </Form>
        </Main>
      </Layout>
    );
  }
}
