import Vue from 'vue';
import Router from 'vue-router';
import Metrics from '@/components/Metrics';
import Twitter from '@/components/Twitter';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Gmail Metrics',
      component: Metrics,
    },
    {
      path: '/twitter',
      name: 'Twitter Metrics',
      component: Twitter,
    },
  ],
});
