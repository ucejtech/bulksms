import firebase from '@/plugins/firebase';
import Vue from 'vue';
import Vuex from 'vuex';
import Auth, { AuthStateType } from './modules/auth';
import User, { UserStateType } from './modules/user';

export interface RootState {
  auth: AuthStateType;
  user: UserStateType;
}

Vue.use(Vuex);

const store = new Vuex.Store<RootState>({
  modules: {
    auth: Auth,
    user: User
  }
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.commit('auth/SET_CURRENT_USER', user);
  }
});

export default store;
