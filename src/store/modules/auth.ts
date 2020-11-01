import {
  Action, Module, VuexModule, Mutation
} from 'vuex-module-decorators';
import firebase from '@/plugins/firebase';
import { AuthenticationModel } from '../../types/index';
import { UserStateType } from './user';

export interface AuthStateType {
    currentUser: null | UserStateType['userProfile'];
}

@Module({
  namespaced: true
})
export default class AuthModule extends VuexModule {
    currentUser: AuthStateType['currentUser'] = null;

    get getLoggedInUser(): AuthStateType['currentUser'] {
      return this.currentUser;
    }

    get isAuthenticated() {
      return !!this.currentUser;
    }

    @Action({ rawError: true })
    login({ email, password }: AuthenticationModel): Promise<{}> {
      return new Promise((resolve, reject) => {
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(({ user }) => {
            this.context.commit('SET_CURRENT_USER', user);
            resolve();
          })
          .catch((error) => reject(error));
      });
    }

    @Action({ rawError: true })
    register({ displayName, email, password }: AuthenticationModel): Promise<{}> {
      return new Promise((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(({ user }) => {
          if (user) {
            user.updateProfile({
              displayName
            }).then(() => {
              this.context.dispatch('user/createDBProfile', user, { root: true });
              resolve();
            });
          }
        })
          .catch((error) => reject(error));
      });
    }

    @Mutation
    SET_CURRENT_USER(user: UserStateType['userProfile']): void {
      this.currentUser = user;
    }

    @Mutation
    CLEAR_SESSION(): void {
      this.currentUser = null;
      window.location.reload();
    }
}
