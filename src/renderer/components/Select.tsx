/* eslint-disable no-underscore-dangle */
import { remote } from 'electron';

import * as Vue from 'vue-tsx-support';
import Component from 'vue-class-component';
import { Prop, Watch, Provide, Inject } from 'vue-property-decorator';
import { State } from 'vuex-class';
import styled, { css } from 'vue-emotion';
import anime from 'animejs';
import Tools from 'utils/tools';

const currentWindow = remote.getCurrentWindow();

// #region stylesheet
interface CustomProps {}

interface OptgroupProps {
  label: string;
}

export const Optgroup = styled<OptgroupProps, CustomProps>('div')`
  &:before {
    content: attr(label);
    display: block;
    margin: 0 8px;
    padding: 0 15px;
    color: #b1b9c0;
    font-size: 16.5px;
    font-weight: bold;
  }
`;

const Opt = styled<OptionProps, OptionEvents>('div')`
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 15px;
  font-weight: 500;
  color: ${(props: OptionProps) => (props.active ? '#3e83f8;' : '')};
  color: ${(props: OptionProps) => (props.selected ? '#fff;' : '')};
  background-color: ${(props: OptionProps) =>
    (props.selected ? '#3e83f8;' : '')};
  &:nth-of-type(1) {
    margin-top: 5px;
  }
  &:nth-last-of-type(1) {
    margin-bottom: 5px;
  }
  :before {
    content: '';
    display: ${(props: OptionProps) => (props.inverse ? 'block' : 'none')};
    position: absolute;
    left: 23px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: #fff;
  }
  img {
    margin-right: 10px;
    width: 44px;
    height: 44px;
    z-index: 1;
  }
`;
// #endregion

export interface OptionProps {
  value?: string;
  active?: boolean;
  inverse?: boolean;
  selected?: boolean;
}

export interface OptionEvents {
  onClick: (e: Event) => void;
  onMouseenter: (e: Event) => void;
}

@Component
export class Option extends Vue.Component<OptionProps, OptionEvents> {
  @Prop({ type: String, required: true })
  public readonly value!: string;

  @Prop({ type: Boolean, required: false, default: false })
  private readonly active!: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  private readonly inverse!: boolean;

  public readonly _uid!: number;

  @Inject()
  private readonly select!: Select;

  @Inject('Option.handleClick')
  private readonly handleClick!: (value: string, uid: number) => void;

  @Inject('Option.handleMouseEnter')
  private readonly handleMouseEnter!: (value: string, uid: number) => void;

  render() {
    return (
      <Opt
        active={this.active}
        inverse={this.inverse}
        selected={this._uid === this.select.selectedOptionId}
        onClick={() => this.handleClick(this.value, this._uid)}
        onMouseenter={() => this.handleMouseEnter(this.value, this._uid)}
      >
        {this.$slots.default}
      </Opt>
    );
  }
}

export interface SelectProps {
  value?: string;
}

export interface SelectEvents {
  onInput: string;
  onSelected: string;
}

@Component
export default class Select extends Vue.Component<SelectProps, SelectEvents> {
  private readonly keymap = {
    up: () => this.move('up'),
    down: () => this.move('down'),
    enter: () => this.handleClick(this.selectedValue, this.selectedOptionId),
  };

  @Provide()
  private get select() {
    return this;
  }

  @Prop({ type: String, required: false })
  public readonly value!: string;

  public selectedOptionId: number = -1;

  public get selectedValue(): string {
    return this.value;
  }

  public set selectedValue(value: string) {
    this.$emit('input', value);
  }

  private get selectedIndex() {
    return this.options.findIndex(
      (item: Option) => item._uid === this.selectedOptionId,
    );
  }

  private get selectedElement(): HTMLElement {
    return this.options[this.selectedIndex].$el;
  }

  public get options(): Option[] {
    return ([] as any[]).concat(
      ...this.$slots.default.map(
        vnode =>
          vnode.children &&
          vnode.children.map(option => option.componentInstance),
      ),
    );
  }

  private disableMouseEnter: boolean = false;

  @Provide('Option.handleMouseEnter')
  private async handleMouseEnter(value: string, uid: number) {
    if (this.disableMouseEnter) {
      // 键盘 up 和 down 操作会自动处理滚动条
      // 当滚动条改变后如果鼠标还在语言范围内会再次触发 mouseenter 事件
      // 为了避免视觉抖动执行 up 和 down 操作时不要执行原逻辑
      this.disableMouseEnter = false;
    } else {
      if (anime.running.length > 0) {
        // 动画过程中设置 selectedValue 会导致动画卡顿
        await Promise.all(anime.running.map(x => x.finished));
        await Tools.sleep(100);
      }
      this.selectedValue = value;
      this.selectedOptionId = uid;
      currentWindow.focus(); // 窗口失焦时也会出发 mouseenter，为了方便键盘操作，自动获得焦点
    }
  }

  @Provide('Option.handleClick')
  private handleClick(value: string, uid: number) {
    this.$emit('selected', value);
    this.selectedOptionId = uid;
  }

  private async move(direction: 'up' | 'down' = 'down') {
    this.disableMouseEnter = true;
    const { length } = this.options;
    const index =
      (direction === 'up'
        ? length + (this.selectedIndex - 1)
        : this.selectedIndex + 1) % length;
    this.selectedValue = this.options[index].value;
    this.selectedOptionId = this.options[index]._uid;
    await this.$nextTick();
    this.selectedElement.scrollIntoView({
      block: 'nearest',
      behavior: 'auto',
    });
  }

  render() {
    return (
      <div
        class={css`
          display: block;
          width: 100%;
          height: 100%;
          border: 0;
        `}
        v-hotkey={this.keymap}
      >
        {this.$slots.default}
      </div>
    );
  }
}
