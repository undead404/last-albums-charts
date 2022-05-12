// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  collection,
  CollectionReference,
  getFirestore,
} from 'firebase/firestore/lite';

import type { TagPayload } from './types';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: '315592981408',
  appId: '1:315592981408:web:1ee4b06749d8d121d682c5',
  measurementId: 'G-6G9BHBNQW2',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// export default firebaseApp;

export const firebaseFirestore = getFirestore(firebaseApp);

// eslint-disable-next-line import/prefer-default-export
export const tagsFirestoreCollection = collection(
  firebaseFirestore,
  'tags',
) as CollectionReference<TagPayload>;
