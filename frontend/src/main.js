// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    dateRange: null,
    loaded: false,
  },
  mutations: {
    updateDateRange(state, value) {
      // mutate state
      state.dateRange = value;
    },
    updateLoaded(state, value) {
      // mutate state
      state.loaded = value;
    },
  },
  strict: true,
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
});
