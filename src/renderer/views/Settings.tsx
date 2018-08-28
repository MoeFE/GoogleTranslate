import Vue from 'vue';
import Component from 'vue-class-component';
import { Mutation } from 'vuex-class';
import styled, { css } from 'vue-emotion';
import anime from 'animejs';
import Layout, { Main, Close, Panel } from 'components/Layout';
import Header from 'components/Header';
import Switch from 'components/Switch';
import Radio from 'components/Radio';
import Link from 'components/Link';
import InputShortcutKeys from 'components/InputShortcutKeys';
import { resize } from '@/utils';
import { IState } from '@/store';

const header = css`
  .right {
    position: static !important;
    right: 0 !important;
  }
`;

const Container = styled.div`
  flex: 1;
  width: 100%;
`;

const Footer = styled.footer`
  width: 100%;
  text-align: center;
`;

const Help = styled.p`
  margin: 5px 0;
  font-size: 12px;
  color: #9ca3a9;
`;

@Component
export default class Settings extends Vue {
  public readonly $refs!: {
    hack: HTMLInputElement;
  };

  private engineMap: {
    [index: string]: string;
  } = {
    baidu: '百度',
    youdao: '有道',
    google: '谷歌',
    googleCN: '国内谷歌',
  };

  @Mutation('save')
  private readonly setState!: (payload: IState) => void;

  private get autoLaunch() {
    return (this.$store.state as IState).autoLaunch;
  }

  private set autoLaunch(autoLaunch) {
    this.setState({ autoLaunch });
  }

  private get defaultEngine() {
    return (this.$store.state as IState).defaultEngine;
  }

  private set defaultEngine(defaultEngine) {
    this.setState({ defaultEngine });
  }

  private get shortcutKeys() {
    return (this.$store.state as IState).shortcutKeys;
  }

  private set shortcutKeys(shortcutKeys) {
    this.setState({ shortcutKeys });
  }

  private handleClose() {
    this.$router.push('/');
  }

  private handleChange(value: string) {
    this.defaultEngine = value;
  }

  async activated() {
    anime({
      targets: Panel.Layout.toString(),
      delay: (el, index) => index * 50,
      translateY: [40, 0],
      translateZ: 0,
    });
    await resize(window.innerWidth, 660);
    this.$refs.hack.focus();
  }

  render() {
    return (
      <Layout>
        <Header class={header}>
          <Close slot="right" onClick={this.handleClose}>
            关闭
          </Close>
        </Header>
        <Main style={{ padding: '20px' }}>
          <Container>
            <Panel.Layout>
              <Panel.Title>自动开始</Panel.Title>
              <Panel.Body>启动 Mac 时自动启动 Google Translate。</Panel.Body>
              <Switch
                v-model={this.autoLaunch}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '20px',
                }}
              />
            </Panel.Layout>
            <Panel.Layout>
              <Panel.Title>定义快捷键</Panel.Title>
              <Panel.Body>
                <p>Google Translate 触手可及，使用此快捷键打开：</p>
                <InputShortcutKeys
                  placeholder="点击添加快捷键"
                  focusPlaceholder="按下按键记录快捷键"
                  v-model={this.shortcutKeys}
                />
              </Panel.Body>
            </Panel.Layout>
            <Panel.Layout>
              <Panel.Title>翻译引擎</Panel.Title>
              <Panel.Body>
                <p>设置 Google Translate 默认使用的翻译引擎：</p>
                {Object.keys(this.engineMap).map(key => (
                  <Radio
                    key={key}
                    name="engine"
                    value={key}
                    checked={key === this.defaultEngine}
                    onChange={this.handleChange}
                  >
                    {this.engineMap[key]}
                  </Radio>
                ))}
              </Panel.Body>
            </Panel.Layout>
            <input
              ref="hack"
              class={css`
                opacity: 0;
              `}
            />
          </Container>
          <Footer>
            <Help>给个 Star 鼓励一下吧 (ฅ´ω`ฅ)</Help>
            <Link href="https://github.com/MoeFE/GoogleTranslate">
              Google Translate
            </Link>
            <Help>{VERSION}</Help>
          </Footer>
        </Main>
      </Layout>
    );
  }
}
