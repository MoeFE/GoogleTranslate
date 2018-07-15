import Vue from 'vue';
import Router from 'vue-router';
import Translate from 'views/Translate';
import Language from 'views/Language';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/language',
      name: 'language',
      component: Language,
    },
    {
      path: '*',
      name: 'translate',
      component: Translate,
    },
  ],
});
