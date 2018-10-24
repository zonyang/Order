// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'common/stylus/index.styl';
import Vue from 'vue';
import App from './App';
import router from './router';
import VueResource from 'vue-resource';
Vue.use(VueResource);
// Vue.config.productionTip = false
new Vue({
  components: { App },
  template: '<App/>',
  router
}).$mount('#app');
// router.push('/goods');
/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>'
// });
