import { remote } from 'electron';
import Vue from 'vue';
import Vuex from 'vuex';
import store from 'store';

Vue.use(Vuex);

export interface IState {
  isAlwaysOnTop?: boolean;
}

const currentWindow = remote.getCurrentWindow();
const initState: IState = {
  isAlwaysOnTop: true,
};

const s = new Vuex.Store<IState>({
  state: store.get('state') || initState,
  mutations: {
    save(state, payload: IState) {
      Object.assign(state, payload);
      store.set('state', state);
    },
  },
  actions: {},
});

s.watch(
  () => s.state,
  () => {
    const { isAlwaysOnTop = true } = s.state;
    currentWindow.setAlwaysOnTop(isAlwaysOnTop);
  },
  {
    deep: true,
    immediate: true,
  },
);

export default s;
