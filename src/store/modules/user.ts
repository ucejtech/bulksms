import firebase from '@/plugins/firebase';
import {
  VuexModule, Module, Action, Mutation
} from 'vuex-module-decorators';

type groupType = {
  name: string;
  contacts: string[];
}

interface ImportContact {
  name?: string;
  phoneNumber?: string;
  email?: string;
}

export interface UserStateType {
  userProfile: {
    metadata?: object;
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    phoneNumber?: string;
    name?: string;
  };
  contactGroups: {
    loading: boolean;
    data: groupType[] | [];
  };
  contacts: {
    loading: boolean;
    data: ImportContact[];
  };
}

@Module({ namespaced: true })
export default class UserModule extends VuexModule {
  contacts: UserStateType['contacts'] = {
    loading: true,
    data: []
  }

  contactGroups: UserStateType['contactGroups'] = {
    loading: true,
    data: []
  }

  userProfile: UserStateType['userProfile'] | {} = {}

  get getContactGroups(): UserStateType['contactGroups'] {
    return this.contactGroups;
  }

  get getContacts() {
    return this.contacts;
  }

  get getUserProfile() {
    return this.userProfile;
  }

  @Action({ rawError: true })
  createDBProfile(user: UserStateType['userProfile']) {
    return new Promise((resolve, reject) => {
      const {
        uid, email, displayName, photoURL
      } = user;
      firebase.firestore().collection('users').doc(uid).set({
        uid, email, displayName, photoURL
      })
        .then(() => {
          this.context.dispatch('fetchDBProfile', user.uid);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  @Action({ rawError: true })
  fetchDBProfile(uid: string) {
    firebase.firestore().collection('users').doc(uid).onSnapshot(doc => {
      const userProfile = doc.data();
      if (userProfile) {
        this.context.commit('SET_USER_PROFILE', userProfile);
      }
    });
  }

  @Action({ rawError: true })
  async addGroup({ group, importedJson }: { group: { name: string; id: string }; importedJson: UserStateType['contacts']['data'] }): Promise<void> {
    const { uid } = this.context.getters.getUserProfile;
    const { name, id } = group;
    const db = firebase.firestore();
    const batch = db.batch();

    const contactsGroupsRef = db.collection('groups').doc(id);
    batch.set(contactsGroupsRef, { name, groupOwner: uid });

    await importedJson.map(async (contact: ImportContact) => {
      const contactsRef = await db.collection('groups').doc(id).collection('contacts').doc(contact.phoneNumber);
      await batch.set(contactsRef, { ...contact });
    });
    return batch.commit();
  }

  @Action({ rawError: true })
  fetchContactGroups(uid: string) {
    firebase.firestore().collection('groups').where('groupOwner', '==', uid).onSnapshot(querySnapshot => {
      const contactGroupsResult: UserStateType['contacts']['data'] = [];
      querySnapshot.forEach(doc => {
        contactGroupsResult.push(doc.data());
      });
      return this.context.commit('SET_USER_CONTACT_GROUPS', contactGroupsResult);
    });
  }

  @Action({ rawError: true })
  async addContacts(contacts: UserStateType['contacts']['data']): Promise<void> {
    const batch = firebase.firestore().batch();
    const { uid } = this.context.getters.getUserProfile;

    await contacts.map(async (contact: ImportContact) => {
      const contactsRef = await firebase.firestore().collection('contacts').doc(contact.phoneNumber);
      await batch.set(contactsRef, { contactOwner: uid, ...contact });
    });
    return batch.commit();
  }

  @Action({ rawError: true })
  fetchContacts(uid: string) {
    firebase.firestore().collection('contacts').where('contactOwner', '==', uid).onSnapshot(querySnapshot => {
      const contactsResult: UserStateType['contacts']['data'] = [];
      querySnapshot.forEach(doc => {
        contactsResult.push(doc.data());
      });
      return this.context.commit('SET_USER_CONTACT', contactsResult);
    });
  }

  @Mutation
  SET_USER_PROFILE(userProfile: UserStateType['userProfile']) {
    this.userProfile = userProfile;
  }

  @Mutation
  CLEAR_USER() {
    this.userProfile = {};
  }

  @Mutation
  SET_USER_CONTACT_GROUPS(groups: UserStateType['contactGroups']['data']) {
    this.contactGroups.data = groups;
    this.contactGroups.loading = false;
  }

  @Mutation
  SET_USER_CONTACT(contacts: UserStateType['contacts']['data']) {
    this.contacts.data = contacts;
    this.contacts.loading = false;
  }
}
