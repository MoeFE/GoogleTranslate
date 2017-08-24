import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/landing',
      name: 'landing-page',
      component: require('@/views/LandingPage')
    },
    {
      path: '/',
      name: 'transition-page',
      component: require('@/views/TransitionPage')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
