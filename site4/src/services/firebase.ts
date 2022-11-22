import {
  Analytics,
  getAnalytics,
  isSupported,
  logEvent,
} from 'firebase/analytics';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { initializePerformance } from 'firebase/performance';
import isEmpty from 'lodash/isEmpty';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

let analytics: Analytics | null = null;

export default async function initAnalytics() {
  if (!import.meta.env.PROD) {
    return;
  }
  if (!import.meta.env.PUBLIC_FIREBASE_API_KEY) {
    throw new Error('PUBLIC_FIREBASE_API_KEY not set');
  }
  if (!import.meta.env.PUBLIC_FIREBASE_APP_ID) {
    throw new Error('PUBLIC_FIREBASE_APP_ID not set');
  }
  if (!import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID) {
    throw new Error('PUBLIC_FIREBASE_MESSAGING_SENDER_ID not set');
  }
  if (!import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID) {
    throw new Error('PUBLIC_FIREBASE_MEASUREMENT_ID not set');
  }
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
    authDomain: `${import.meta.env.PUBLIC_FIREBASE_PROJECT_ID}.web.app`,
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: `${import.meta.env.PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
    messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
    measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
  // Initialize Firebase
  const app = isEmpty(getApps()) ? initializeApp(firebaseConfig) : getApp();
  if (!(await isSupported())) {
    return;
  }
  analytics = getAnalytics(app);
  initializePerformance(app);
}

// eslint-disable-next-line import/prefer-default-export
export async function logAnalyticsEvent(
  event: string,
  eventParameters?: {
    [key: string]: unknown;
  },
): Promise<void> {
  if (!analytics) {
    return;
  }
  if (!(await isSupported())) {
    return;
  }
  logEvent(analytics, event, eventParameters);
}
