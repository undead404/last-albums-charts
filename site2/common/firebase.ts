import {
  Analytics,
  getAnalytics,
  isSupported,
  logEvent,
} from 'firebase/analytics';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { initializePerformance } from 'firebase/performance';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

let analytics: Analytics | null = null;

if (process.env.NODE_ENV === 'production') {
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}.firebaseapp.com`,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}.appspot.com`,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
  // Initialize Firebase
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  if (process.env.NODE_ENV === 'production' && isSupported()) {
    analytics = getAnalytics(app);
    initializePerformance(app);
  }
}

// eslint-disable-next-line import/prefer-default-export
export function logAnalyticsEvent(
  event: string,
  eventParameters?: {
    [key: string]: unknown;
  },
): void {
  if (process.env.NODE_ENV === 'production' && analytics && isSupported()) {
    logEvent(analytics, event, eventParameters);
  } else {
    // eslint-disable-next-line no-console
    console.debug(event, eventParameters);
  }
}
