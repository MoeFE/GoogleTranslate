import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch, Provide } from 'vue-property-decorator';
import styled, { css } from 'vue-emotion';
import Layout, { Main } from 'components/Layout';
import Header from 'components/Header';
import Icon from 'components/Icon';
import Language from 'components/Language';
import Tools from 'utils/tools';

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
  private source = { country: 'zh-CN', value: '', loading: false };
  private target = { country: 'en-UK', value: '', loading: false };

  @Provide('handleResize')
  private async handleResize() {
    const form = this.$refs.form as HTMLFormElement;
    const formHeight = [...form.children]
      .map(el => el.clientHeight)
      .reduce((prev, next) => prev + next);
    const innerHeight = 190 + (formHeight + 18) - 129; // eslint-disable-line no-mixed-operators
    if (innerHeight !== window.innerHeight) {
      form.scrollTop = 0; // 滚动条位置始终设置为0，防止视觉抖动
      Tools.resize(window.innerWidth, innerHeight);
    }
  }

  private async handleSwitch(e: MouseEvent | string) {
    await this.$nextTick();
    if (typeof e === 'object' || this.target.value) {
      [this.source, this.target] = [this.target, this.source];
      (this.$refs.slang as Language).tbox.focus();
      this.target.value = '';
    }
  }

  activated() {
    Tools.resize(window.innerWidth, 190);
  }

  render() {
    return (
      <Layout>
        <Header class={header}>
          <Icon type="fixed" slot="left" />
          <Icon type="settings" slot="right" />
        </Header>
        <Main style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Form ref="form">
            <Language
              ref="slang"
              country={this.source.country}
              loading={this.source.loading}
              v-model={this.source.value}
              allowClear
            />
            <Divider>
              <Switch type="switch" nativeOnClick={this.handleSwitch} />
            </Divider>
            <Language
              country={this.target.country}
              loading={this.target.loading}
              v-model={this.target.value}
              readOnly={this.source.country === 'auto'}
              onInput={this.handleSwitch}
            />
          </Form>
        </Main>
      </Layout>
    );
  }
}
