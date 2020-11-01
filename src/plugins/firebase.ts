import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCqodAjOMQJDzT_tVoJDQERGkg3iPqaxAE',
  authDomain: 'spaas-8500c.firebaseapp.com',
  databaseURL: 'https://spaas-8500c.firebaseio.com',
  projectId: 'spaas-8500c',
  storageBucket: 'spaas-8500c.appspot.com',
  messagingSenderId: '1015380422709',
  appId: '1:1015380422709:web:43d2fd1cc1d42c4f25817c'
};

firebase.initializeApp(firebaseConfig);

export default firebase;
