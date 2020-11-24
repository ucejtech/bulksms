import { ConstantsObject } from '../types';

const constants: ConstantsObject = {
  appTitle: 'Voya',
  authError: {
    'auth/user-not-found': 'User does not exist',
    'auth/network-request-failed': 'No Internet Connection',
    'auth/wrong-password': 'Incorrect E-mail / Password',
    'auth/requires-recent-login': 'You would need to re-login to continue'
  },
  pricePerSMS: '9.8'
};

export default constants;
