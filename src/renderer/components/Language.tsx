import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import styled, { css } from 'vue-emotion';
import Icon from './Icon';
import Country from './Country';
import Loading from './Loading';
import TextBox from './TextBox';

const languages: any = {
  auto: '检测语言',
  'zh-CN': '中文（简体）',
  'en-UK': '英语',
};

// #region stylesheet
const country = css`
  position: relative;
  width: 44px;
  height: 44px;
  img {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
  }
  &:after {
    content: '\\e602';
    color: #3e83f8;
    font-family: icon;
    font-weight: bold;
    position: absolute;
    z-index: 1;
    left: 50%;
    bottom: -5px;
    opacity: 0;
    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform: translate3d(-50%, -20px, 0);
    pointer-events: none;
  }
  &:hover:after {
    opacity: 1;
    transform: translate3d(-50%, 0, 0);
  }
`;

const Lang = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 0 10px;
  .icon {
    align-self: center;
    color: #ccc;
    font-size: 22px;
    margin: 0 5px;
    &:hover {
      color: #bbb;
    }
    &.icon-clear {
      position: relative;
      color: #fff;
      background: #ccc;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 14px;
      &:before {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
      }
      &:hover {
        background: #bbb;
      }
    }
  }
`;

const Action = styled.div`
  display: flex;
  align-self: flex-start;
  justify-content: flex-end;
  align-items: center;
  margin: 10px 0;
  width: 60px;
`;

const ProgressBar = styled(Action)`
  margin: 8px 0;
  padding-right: 5px;
  box-sizing: border-box;
`;

const Spin = styled.div`
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 28px;
  border: 2px solid transparent;
  border-top-color: #3e83f8;
  border-right-color: #3e83f8;
  border-bottom-color: rgba(62, 131, 248, 0);
  border-left-color: rgba(62, 131, 248, 0);
  box-sizing: border-box;
  background: #fff;
  background-clip: padding-box;
  animation: loading 0.8s linear infinite;
  @keyframes loading {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
// #endregion

@Component
export default class Language extends Vue {
  public readonly $refs!: {
    tbox: TextBox;
  };

  @Prop({ type: String, required: false })
  private readonly value!: string;

  @Prop({ type: String, required: false, default: 'auto' })
  private readonly country!: string;

  @Prop({ type: Boolean, required: false, default: false })
  private readonly loading!: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  private readonly error!: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  private readonly allowClear!: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  private readonly readOnly!: boolean;

  private get text(): string {
    return this.value;
  }

  private set text(value: string) {
    this.$emit('input', value);
  }

  public get tbox(): HTMLTextAreaElement {
    return this.$refs.tbox.$el as HTMLTextAreaElement;
  }

  private handleClear() {
    this.text = '';
  }

  private handleEnter(e: Event) {
    this.$emit('enter', e);
  }

  render() {
    const { loading, allowClear, readOnly } = this;

    return (
      <Lang>
        <div class={country}>
          <Country code={this.country} />
        </div>
        {loading ? (
          <Loading />
        ) : (
          <TextBox
            ref="tbox"
            style={{ color: this.error ? '#ff2600' : '' }}
            placeholder={languages[this.country]}
            readonly={readOnly}
            v-model={this.text}
            onEnter={this.handleEnter}
          />
        )}
        <Action v-show={this.text}>
          {allowClear ? <Icon type="clear" onClick={this.handleClear} /> : null}
          <Icon
            type="speak"
            style={{ visibility: this.country === 'auto' ? 'hidden' : '' }}
          />
        </Action>
      </Lang>
    );
  }
}
