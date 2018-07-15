import { remote } from 'electron';
import Vue from 'vue';
import Vuex from 'vuex';
import store from 'store';
import { IDialects } from 'assets/languages';

Vue.use(Vuex);

export interface ILang {
  key: string;
  country: string;
}

export interface IState {
  isAlwaysOnTop?: boolean;
  sourceLang?: ILang;
  targetLang?: ILang;
  recentlyUsed?: IDialects;
}

const currentWindow = remote.getCurrentWindow();
const initState: IState = {
  isAlwaysOnTop: true,
  sourceLang: {
    key: 'zh-CN',
    country: 'zh-CN',
  },
  targetLang: {
    key: 'en',
    country: 'en-UK',
  },
  recentlyUsed: [
    {
      asr_host: 'bm.nvc.chMN.nuancemobility.net',
      asr: 'zh-CN',
      flag_image_1x: 'http://api.itranslateapp.com/flags/zh-CN.png',
      localized_name: 'Chinese (Mandarin)',
      key: 'zh-CN',
      flag_image_2x: 'http://api.itranslateapp.com/flags/zh-CN-2x.png',
      tts: { male: 'chchinesemale', female: 'chchinesefemale' },
      tts_offline: { male: '', female: 'zh-CN' },
    },
    {
      asr_host: 'bm.nvc.enGB.nuancemobility.net',
      asr: 'en',
      flag_image_1x: 'http://api.itranslateapp.com/flags/en-UK.png',
      localized_name: 'English (GB)',
      key: 'en-UK',
      flag_image_2x: 'http://api.itranslateapp.com/flags/en-UK-2x.png',
      tts: { male: 'ukenglishmale', female: 'ukenglishfemale' },
      tts_offline: { male: 'en-GB', female: '' },
    },
  ],
};

const s = new Vuex.Store<IState>({
  state: {
    ...initState,
    ...store.get('state'),
  },
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
