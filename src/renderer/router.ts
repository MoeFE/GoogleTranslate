import Vue from 'vue';
import Router from 'vue-router';
import Translate from 'views/Translate';
import Language from 'views/Language';
import Settings from 'views/Settings';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/language',
      name: 'language',
      component: Language,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    {
      path: '*',
      name: 'translate',
      component: Translate,
    },
  ],
});
