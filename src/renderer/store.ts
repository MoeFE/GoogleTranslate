import { remote } from 'electron';
import Vue from 'vue';
import Vuex from 'vuex';
import store from 'store';
import AutoLaunch from 'auto-launch';
import { IDialects } from 'assets/languages';

const { Notification } = remote;

Vue.use(Vuex);

export interface ILang {
  key: string;
  country: string;
}

export interface IState {
  autoLaunch?: boolean;
  isAlwaysOnTop?: boolean;
  shortcutKeys?: string;
  defaultEngine?: string;
  sourceLang?: ILang;
  targetLang?: ILang;
  recentlyUsed?: IDialects;
}

const googleTranslateAutoLauncher = new AutoLaunch({
  name: 'Google 翻译',
});

const window = remote.getCurrentWindow();

const initState: IState = {
  autoLaunch: false,
  isAlwaysOnTop: true,
  shortcutKeys: '',
  defaultEngine: 'google',
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

const $store = new Vuex.Store<IState>({
  state: {
    ...initState,
    ...store.get('state'),
  },
  getters: {
    translateParams({ defaultEngine }) {
      if (defaultEngine) {
        return [defaultEngine.replace('CN', ''), defaultEngine === 'google'];
      }
      return ['google', true];
    },
  },
  mutations: {
    save(state, payload: IState) {
      Object.assign(state, payload);
      store.set('state', state);
    },
  },
  actions: {},
});

$store.watch(
  () => $store.state,
  async () => {
    const {
      autoLaunch = false,
      isAlwaysOnTop = true,
      shortcutKeys,
    } = $store.state;
    try {
      if (autoLaunch) {
        await googleTranslateAutoLauncher.enable();
      } else if (await googleTranslateAutoLauncher.isEnabled()) {
        await googleTranslateAutoLauncher.disable();
      }
    } catch (ex) {
      // eslint-disable-next-line no-new
      const notice = new Notification({
        title: 'Google 翻译',
        body: '添加到启动项失败，请联系技术支持，获得帮助。',
      });
      notice.on('click', () =>
        remote.shell.openExternal(
          'https://github.com/MoeFE/GoogleTranslate/issues/new',
        ),
      );
      notice.show();
    } finally {
      window.setAlwaysOnTop(isAlwaysOnTop);
      if (shortcutKeys) {
        remote.globalShortcut.unregisterAll();
        remote.globalShortcut.register(shortcutKeys, () => {
          if (window.isVisible()) window.hide();
          else window.show();
        });
      } else remote.globalShortcut.unregisterAll();
    }
  },
  {
    deep: true,
    immediate: true,
  },
);

export default $store;
