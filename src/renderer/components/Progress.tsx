import * as Vue from 'vue-tsx-support';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import styled from 'vue-emotion';

// #region stylesheet
const ProgressBar = styled.div`
  position: relative;
  display: inline-block;
  width: 28px;
  height: 28px;
`;

const Pause = styled.i`
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0;
  &:before,
  &:after {
    content: '';
    display: inline-block;
    width: 3px;
    height: 12px;
    margin: 0 2px;
    background: #3e83f8;
  }
`;

export const Spin = styled.div`
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
  animation: spin-loading 0.8s linear infinite;
  @keyframes spin-loading {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
// #endregion

export interface ProgressProps {
  value?: number;
  strokeWidth?: number;
  duration?: number;
  easing?: string;
}

export interface ProgressEvents {
  onPause: MouseEvent;
}

@Component
export default class Progress extends Vue.Component<
  ProgressProps,
  ProgressEvents
> {
  @Prop({ type: Number, required: false, default: 0 })
  private readonly value!: number;

  @Prop({ type: Number, required: false, default: 7 })
  private readonly strokeWidth!: number;

  @Prop({ type: Number, required: false, default: 1000 })
  private readonly duration!: number;

  @Prop({ type: String, required: false, default: 'linear' })
  private readonly easing!: string;

  private path: string = 'M 50,50 m 0,-47 a 47,47 0 1 1 0,94 a 47,47 0 1 1 0,-94'; // prettier-ignore

  private get strokeDashoffset() {
    return (1 - this.value) * 295.416;
  }

  private handlePause(e: MouseEvent) {
    this.$emit('pause', e);
  }

  render() {
    const { path, strokeWidth, strokeDashoffset } = this;

    return (
      <ProgressBar onClick={this.handlePause}>
        <svg viewBox="0 0 100 100">
          <path
            d={path}
            stroke="transparent"
            stroke-width={strokeWidth}
            fill-opacity="0"
          />
          <path
            d={path}
            stroke="#3e83f8"
            stroke-width={strokeWidth}
            fill-opacity="0"
            style={{
              strokeDasharray: '295.416, 295.416',
              strokeDashoffset,
            }}
          />
        </svg>
        <Pause />
      </ProgressBar>
    );
  }
}
