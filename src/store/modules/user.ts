import firebase from '@/plugins/firebase';
import {
  VuexModule, Module, Action, Mutation
} from 'vuex-module-decorators';

export type groupType = {
  name: string;
  contacts: string[];
  id: string;
}

export interface Contact {
  name?: string;
  phoneNumber?: string;
  email?: string;
}

export interface Message {
  title?: string;
  content?: string;
  recipients?: string;
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
    data: Contact[];
  };
  messageTemplate: {
    loading: boolean;
    data: Message[];
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

  messageTemplate: UserStateType['messageTemplate'] = {
    loading: true,
    data: []
  }

  messageHistory: UserStateType['messageTemplate'] = {
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

  get getMessageTemplate(): UserStateType['messageTemplate'] {
    return this.messageTemplate;
  }

  get getMessageHistory(): UserStateType['messageTemplate'] {
    return this.messageHistory;
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
    batch.set(contactsGroupsRef, { name, groupOwner: uid, id });

    await importedJson.map(async (contact: Contact) => {
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
  fetchMessageTemplates(uid: string) {
    firebase.firestore().collection('templates').where('templateOwner', '==', uid).onSnapshot(querySnapshot => {
      const messageTemplatesResult: UserStateType['messageTemplate']['data'] = [];
      querySnapshot.forEach(doc => {
        messageTemplatesResult.push(doc.data());
      });
      return this.context.commit('SET_USER_MESSAGE_TEMPLATES', messageTemplatesResult);
    });
  }

  @Action({ rawError: true })
  fetchMessageHistory(uid: string) {
    firebase.firestore().collection('messageHistory').where('messageOwner', '==', uid).orderBy('date')
      .onSnapshot(querySnapshot => {
        const messageHistoryResult: UserStateType['messageTemplate']['data'] = [];
        querySnapshot.forEach(doc => {
          messageHistoryResult.push(doc.data());
        });
        return this.context.commit('SET_USER_MESSAGE_HISTORY', messageHistoryResult);
      });
  }

  @Action({ rawError: true })
  async addContacts(contacts: UserStateType['contacts']['data']): Promise<void> {
    const batch = firebase.firestore().batch();
    const { uid } = this.context.getters.getUserProfile;

    await contacts.map(async (contact: Contact) => {
      const contactsRef = await firebase.firestore().collection('contacts').doc(uid).collection('list')
        .doc(contact.phoneNumber);
      await batch.set(contactsRef, { contactOwner: uid, ...contact });
    });
    return batch.commit();
  }

  @Action({ rawError: true })
  fetchContacts(uid: string) {
    firebase.firestore().collection('contacts').doc(uid).collection('list')
      .where('contactOwner', '==', uid)
      .onSnapshot(querySnapshot => {
        const contactsResult: UserStateType['contacts']['data'] = [];
        querySnapshot.forEach(doc => {
          contactsResult.push(doc.data());
        });
        return this.context.commit('SET_USER_CONTACT', contactsResult);
      });
  }

  @Action({ rawError: true })
  sendBulkSMS(sendMessageModel: { content: string }) {
    return new Promise((resolve, reject) => {
      const sendSMS = firebase.functions().httpsCallable('sendSMS');
      sendSMS(sendMessageModel).then(() => {
        resolve(this.context.getters.getContacts);
      }).catch(err => {
        reject(err);
      });
    });
  }

  @Action({ rawError: true })
  addTemplate(addTemplate: object) {
    return new Promise((resolve, reject) => {
      const addTemplateRequest = firebase.functions().httpsCallable('createMessageTemplate');
      addTemplateRequest(addTemplate).then(() => {
        resolve(this.context.getters.getMessageTemplate);
      }).catch(err => {
        reject(err);
      });
    });
  }

  @Mutation
  SET_USER_PROFILE(userProfile: UserStateType['userProfile']) {
    this.userProfile = userProfile;
  }

  @Mutation
  CLEAR_USER() {
    this.userProfile = {};
    this.contactGroups.data = [];
    this.contacts.data = [];
    this.messageHistory.data = [];
    this.messageTemplate.data = [];
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

  @Mutation
  SET_USER_MESSAGE_TEMPLATES(messageTemplate: UserStateType['messageTemplate']['data']) {
    this.messageTemplate.data = messageTemplate;
    this.messageTemplate.loading = false;
  }

  @Mutation
  SET_USER_MESSAGE_HISTORY(messageHistory: UserStateType['messageTemplate']['data']) {
    this.messageHistory.data = messageHistory;
    this.messageHistory.loading = false;
  }
}
