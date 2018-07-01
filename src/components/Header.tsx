import Vue from 'vue';
import Component from 'vue-class-component';
import styled, { css } from 'vue-emotion';
import * as Layout from 'components/Layout';

const H1 = styled.h1`
  margin: 0;
  font-family: google;
  font-weight: 500;
  text-align: center;
  flex: 1;
  i {
    display: inline-block;
    font-style: normal;
    transform: rotate(-10deg);
  }
`;

@Component
export default class Header extends Vue {
  render() {
    return (
      <Layout.Header>
        {this.$slots.left ? <div class="left">{this.$slots.left}</div> : null}
        <H1>
          Googl<i>e</i> Translate
        </H1>
        {this.$slots.right ? (
          <div class="right">{this.$slots.right}</div>
        ) : null}
      </Layout.Header>
    );
  }
}
