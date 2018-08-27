/* eslint-disable no-nested-ternary */
import * as Vue from 'vue-tsx-support';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import styled from 'vue-emotion';
import keycode from 'keycode';
import anime from 'animejs';
import Icon from './Icon';

// #region stylesheet
const Input = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  appearance: none;
  outline: 0;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 300;
  width: 100%;
  height: 55px;
  padding: 5px;
  background: #fff;
  box-shadow: 0 0.5px 0.5px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  -webkit-user-modify: read-only;
  &:focus {
    border: 1px solid #199bff;
    &:empty:before {
      content: attr(focusPlaceholder);
      color: #bbb;
      padding: 0 10px;
    }
  }
  &:empty:before {
    content: attr(placeholder);
    color: #bbb;
    padding: 0 10px;
  }
  .icon {
    outline: none;
    &.icon-clear {
      position: absolute;
      right: 12px;
      color: #fff;
      background: #ccc;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      font-size: 12px;
      font-weight: bold;
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

const Shortcut = styled.div`
  display: inline-flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  position: relative;
  width: 45px;
  height: 45px;
  border-radius: 5px;
  margin-right: 10px;
  padding: 0 3px;
  border: 1px solid #c2c7cc;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  color: #000;
  background: #fff;
  font-weight: 500;
`;

const Key = styled.span`
  font-size: 24px;
  font-family: arial;
`;

const Badge = styled.span`
  font-size: 18px;
  align-self: flex-end;
  + ${Key.toString()} {
    font-size: 9px;
    align-self: flex-end;
    font-family: inherit;
  }
`;
// #endregion

interface IKeyMap {
  icon: string;
  text: string;
  sort: number;
}

const keyMap: {
  [index: string]: IKeyMap;
} = {
  Alt: { icon: '⌥', text: 'alt', sort: 1 },
  Control: { icon: '⌃', text: 'ctrl', sort: 2 },
  Meta: { icon: '⌘', text: 'cmd', sort: 0 },
  Shift: { icon: '⇧', text: 'shift', sort: 3 },
  Enter: { icon: '', text: '↩', sort: 4 },
  Backspace: { icon: '', text: '⌫', sort: 4 },
  ArrowUp: { icon: '', text: '↑', sort: 4 },
  ArrowRight: { icon: '', text: '→', sort: 4 },
  ArrowDown: { icon: '', text: '↓', sort: 4 },
  ArrowLeft: { icon: '', text: '←', sort: 4 },
  ' ': { icon: '　', text: 'space', sort: 4 },
};

const banList = ['CapsLock', 'Escape'];

interface ShortcutKeysProps {
  value: string;
}

@Component
class ShortcutKeys extends Vue.Component<ShortcutKeysProps> {
  @Prop({ type: String, required: true })
  private readonly value!: string;

  private get keyCombinations() {
    return keyMap[this.value] || {};
  }

  render() {
    const { icon, text = this.value } = this.keyCombinations;
    return (
      <Shortcut>
        {icon ? <Badge>{icon}</Badge> : null}
        <Key>{text}</Key>
      </Shortcut>
    );
  }
}

export interface InputShortcutKeysProps {
  value?: string;
  placeholder?: string;
  focusPlaceholder?: string;
}

export interface InputShortcutKeysEvents {
  input: string;
}

@Component
export default class InputShortcutKeys extends Vue.Component<
  InputShortcutKeysProps,
  InputShortcutKeysEvents
> {
  public readonly $refs!: {
    input: HTMLDivElement;
  };

  @Prop({ type: String, required: false })
  private readonly value!: string;

  private cacheKeys: string[] = [];

  private get keys(): string[] {
    this.$nextTick().then(() => {
      anime({
        targets: this.$refs.input.children,
        easing: 'easeOutQuart',
        duration: 300,
        translateX: 0,
        translateZ: 0,
      });
    });
    return this.value ? this.value.replace('Cmd', 'Meta').split('+') : [];
  }

  private set keys(value: string[]) {
    const keys = Object.keys(keyMap).splice(0, 4);
    if (value.length <= 0 || value.some(key => !keys.includes(key))) {
      this.$emit('input', value.join('+').replace('Meta', 'Cmd'));
    }
  }

  private get distinctKeys() {
    return [...new Set(this.keys)].sort((a, b) => {
      if (!keyMap[a] || !keyMap[b]) return -1;
      return keyMap[a].sort - keyMap[b].sort;
    });
  }

  private handleFocus() {
    this.keys = [];
    this.cacheKeys = [];
  }

  private handleClear(e: Event) {
    e.stopPropagation();
    this.handleFocus();
  }

  private async handleKeydown(e: Event) {
    const { altKey, shiftKey, key, keyCode, target } = e as KeyboardEvent;
    if (banList.includes(key)) return;
    const keyChar = keycode(e); // String.fromCharCode(keyCode);
    const isKeyCombinations = Object.keys(keyMap)
      .splice(0, 4)
      .includes(key);

    this.cacheKeys.push(
      altKey && !isKeyCombinations
        ? shiftKey
          ? keyChar.toUpperCase()
          : keyChar.toLowerCase()
        : shiftKey && !isKeyCombinations
          ? key.toUpperCase()
          : key,
    );

    if (!isKeyCombinations) {
      this.keys = this.cacheKeys;
      if (target) (target as HTMLDivElement).blur();
    }
  }

  render() {
    return (
      <Input
        ref="input"
        tabindex={-1}
        onFocus={this.handleFocus}
        onKeyup={this.handleFocus}
        onKeydown={this.handleKeydown}
      >
        {this.distinctKeys.map((key, index) => (
          <ShortcutKeys
            key={key}
            value={key}
            style={{
              transform: `translateX(-${index * 55}px)`,
            }}
          />
        ))}
        {this.distinctKeys.length > 0 ? (
          <Icon tabindex={-1} type="clear" onFocus={this.handleClear} />
        ) : null}
      </Input>
    );
  }
}
