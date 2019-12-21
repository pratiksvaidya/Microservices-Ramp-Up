import Vue from 'vue';
import Router from 'vue-router';
import Metrics from '@/components/Metrics';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Metrics',
      component: Metrics,
    },
  ],
});
