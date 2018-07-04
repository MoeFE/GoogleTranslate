import Vue from 'vue';
import VueHotkey from 'v-hotkey';
import App from './App';
import router from './router';
import store from './store';

Vue.use(VueHotkey);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
