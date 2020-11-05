import firebase from '@/plugins/firebase';
import { ImportContact, UserStateType } from '../store/modules/user';

class FirebaseHelper {
  static getGroupContacts = async (id: string): Promise<ImportContact[]> => {
    try {
      const results: UserStateType['contacts']['data'] = [];
      const contacts = await firebase.firestore().collection('groups').doc(id).collection('contacts')
        .get();
      contacts.forEach(doc => {
        results.push(doc.data());
      });
      return results;
    } catch (error) {
      console.log(error);
      return [];
    }
  };
}

export default FirebaseHelper;
