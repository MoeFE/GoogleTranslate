import Vue from 'vue';
import Component from 'vue-class-component';
import styled from 'vue-emotion';

const Indicator = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  align-self: center;
  > i {
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 4px;
    margin: 0 3px;
    opacity: 0.5;
    background: #3e83f8;
    &:nth-of-type(1) {
      animation: loading 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) 0.1s infinite;
    }
    &:nth-of-type(2) {
      animation: loading 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) 0.2s infinite;
    }
    &:nth-of-type(3) {
      animation: loading 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) 0.3s infinite;
    }
  }
  @keyframes loading {
    0% {
      opacity: 0.5;
      transform: scale(1);
    }
    25% {
      opacity: 0.75;
      transform: scale(1.5);
    }
    50% {
      opacity: 1;
      transform: scale(2);
    }
    100% {
      opacity: 0.5;
      transform: scale(1);
    }
  }
`;

@Component
export default class Loading extends Vue {
  render() {
    return <Indicator>{[...Array(3)].map(() => <i />)}</Indicator>;
  }
}
