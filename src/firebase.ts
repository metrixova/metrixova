import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyABsWkg8J-TbzZff8xJvVEV52q2Qh1g0h0',
  authDomain: 'metrixova.firebaseapp.com',
  projectId: 'metrixova',
  storageBucket: 'metrixova.firebasestorage.app',
  messagingSenderId: '768009713765',
  appId: '1:768009713765:web:dfe335819b2537abc52e8c',
  measurementId: 'G-44EXQ4LWEY'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
