import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

const firebaseConfig = {
  apiKey: '<API_KEY>',
  authDomain: '<AUTH_DOMAIN>',
  databaseURL: '<DATABASE_URL>',
  projectId: '<PROJECT_ID>',
  storageBucket: '<STORAGE_BUCKET>',
  messagingSenderId: '<MESSAGING_ID>',
  appId: '<APP_ID>'
};

firebase.initializeApp(firebaseConfig);

// if (process.env.NODE_ENV === 'development') {
//   const functions = firebase.functions();
//   functions.useFunctionsEmulator('http://localhost:5001');
// }

export default firebase;
