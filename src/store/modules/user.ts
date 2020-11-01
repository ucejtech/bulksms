import firebase from '@/plugins/firebase';
import {
  VuexModule, Module, Action, Mutation
} from 'vuex-module-decorators';

export interface UserStateType {
    userProfile: {
        metadata?: object;
        uid: string;
        email: string;
        displayName: string;
        photoURL?: string;
    };
}

@Module({ namespaced: true })
export default class UserModule extends VuexModule {
    userProfile: UserStateType['userProfile'] | {} = {}

    @Action({ rawError: true })
    createDBProfile(user: UserStateType['userProfile']) {
      return new Promise((resolve, reject) => {
        const {
          uid, email, displayName, photoURL
        } = user;
        firebase.database().ref('users').child(uid).set({
          uid, email, displayName, photoURL
        }, (err) => {
          if (err) reject(err);
          this.context.dispatch('fetchDBProfile', user.uid);
          resolve();
        });
      });
    }

    @Action({ rawError: true })
    fetchDBProfile(uid: string) {
      firebase.database().ref('users').child(uid).on('value', (snapshot) => {
        const userProfile = snapshot.val();
        if (userProfile) {
          this.context.commit('SET_USER_PROFILE', userProfile);
        }
      });
    }

    @Mutation
    SET_USER_PROFILE(userProfile: UserStateType['userProfile']) {
      this.userProfile = userProfile;
    }
}
