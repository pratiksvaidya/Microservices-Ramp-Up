import Vue from 'vue';
import Router from 'vue-router';
import Email from '@/components/Email';
import Twitter from '@/components/Twitter';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Gmail Metrics',
      component: Email,
    },
    {
      path: '/twitter',
      name: 'Twitter Metrics',
      component: Twitter,
    },
  ],
});
