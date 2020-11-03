import Vue from 'vue';
import notify from '@/utils/notify';
import { ToastObject, ConstantsObject } from './types/index';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import 'izitoast/dist/css/iziToast.min.css';
import App from './App.vue';
import HomeAbstractSVG from './components/home-abstract-svg.vue';
// import SidebarAbstractSVG from './components/dashboard/sidebar-abstract-svg.vue';
import constants from './app/constants';
import firebase from './plugins/firebase';

Vue.component('home-abstract-svg', HomeAbstractSVG);
// Vue.component('sidebar-abstract-svg', SidebarAbstractSVG);

declare module 'vue/types/vue' {
  interface VueConstructor {
    $toast: ToastObject;
    $constants: ConstantsObject;
  }
  interface Vue {
    $toast: ToastObject;
    $constants: ConstantsObject;
  }
}

Vue.prototype.$toast = notify;
Vue.prototype.$constants = constants;

Vue.config.productionTip = false;

const app = null;
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app');
  }
});
