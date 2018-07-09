import Vue from 'vue';
import Router from 'vue-router';
import Translate from 'views/Translate';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '*',
      name: 'translate',
      component: Translate,
    },
  ],
});
