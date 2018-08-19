import * as Vue from 'vue-tsx-support';
import Component from 'vue-class-component';
import { Prop, Inject } from 'vue-property-decorator';
import styled, { css } from 'vue-emotion';
import Icon from './Icon';
import Country from './Country';
import Loading from './Loading';
import TextBox from './TextBox';

// #region stylesheet
const CountryWrapper = styled.div`
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

const Progress = styled(Action)`
  margin: 8px 0;
  padding-right: 5px;
  box-sizing: border-box;
`;
// #endregion

export interface LanguageProps {
  value?: string;
  country?: string;
  action?: boolean;
  loading?: boolean;
  error?: boolean;
  allowClear?: boolean;
  readOnly?: boolean;
}

export interface LanguageEvents {
  onInput: string;
  onClick: Event;
  onSpeak: Event;
  onEnter: Event;
}

@Component
export default class Language extends Vue.Component<
  LanguageProps,
  LanguageEvents
> {
  public readonly $refs!: {
    tbox: TextBox;
  };

  @Prop({ type: String, required: false })
  private readonly value!: string;

  @Prop({ type: String, required: false, default: 'auto' })
  private readonly country!: string;

  @Prop({ type: Boolean, required: false, default: true })
  private readonly action!: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  private readonly loading!: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  private readonly error!: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  private readonly allowClear!: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  private readonly readOnly!: boolean;

  @Inject()
  private readonly localeProvider!: any;

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

  private handleClick(e: Event) {
    this.$emit('click', e);
  }

  private handleSpeak(e: Event) {
    this.$emit('speak', e);
  }

  private handleEnter(e: Event) {
    this.$emit('enter', e);
  }

  render() {
    const { country, loading, action, allowClear, readOnly } = this;
    const { languages } = this.localeProvider;

    return (
      <Lang>
        <CountryWrapper>
          <Country code={country} onClick={this.handleClick} />
        </CountryWrapper>
        {loading ? (
          <Loading />
        ) : (
          <TextBox
            ref="tbox"
            style={{ color: this.error ? '#ff2600' : '' }}
            placeholder={languages[country]}
            readonly={readOnly}
            v-model={this.text}
            onEnter={this.handleEnter}
          />
        )}
        <Action v-show={this.text && action}>
          {allowClear ? <Icon type="clear" onClick={this.handleClear} /> : null}
          <Icon
            type="speak"
            style={{ visibility: country === 'auto' ? 'hidden' : '' }}
            onClick={this.handleSpeak as any} // TODO: 这里的事件处理类型有问题，暂时需要强制转换成 any 类型（vue-tsx-support bug）
          />
        </Action>
        {this.$slots.progress ? (
          <Progress>{this.$slots.progress}</Progress>
        ) : null}
      </Lang>
    );
  }
}
