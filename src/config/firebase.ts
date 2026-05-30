import { initializeApp } from 'firebase/app';
import { initializeAuth, Persistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// getReactNativePersistence exists in Metro's RN bundle (dist/rn/index.js)
// but TypeScript 6 doesn't expose it from firebase/auth types — use require
const { getReactNativePersistence } = require('firebase/auth') as {
  getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
};

const firebaseConfig = {
  apiKey: 'AIzaSyAz-8GIB95jWER9N0H9ojUVTUn9EQLTUzU',
  authDomain: 'species-app-760ae.firebaseapp.com',
  databaseURL: 'https://species-app-760ae-default-rtdb.firebaseio.com',
  projectId: 'species-app-760ae',
  storageBucket: 'species-app-760ae.firebasestorage.app',
  messagingSenderId: '258573850055',
  appId: '1:258573850055:web:0e02e5bd190abc1713b5e2',
};

export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
