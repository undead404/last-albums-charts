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

async function initAnalytics() {
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.PUBLIC_FIREBASE_API_KEY) {
      throw new Error('PUBLIC_FIREBASE_API_KEY not set');
    }
    if (!process.env.PUBLIC_FIREBASE_APP_ID) {
      throw new Error('PUBLIC_FIREBASE_APP_ID not set');
    }
    if (!process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID) {
      throw new Error('PUBLIC_FIREBASE_MESSAGING_SENDER_ID not set');
    }
    if (!process.env.PUBLIC_FIREBASE_MEASUREMENT_ID) {
      throw new Error('PUBLIC_FIREBASE_MEASUREMENT_ID not set');
    }
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: process.env.PUBLIC_FIREBASE_API_KEY,
      authDomain: `${process.env.PUBLIC_FIREBASE_APP_ID}.firebaseapp.com`,
      projectId: process.env.PUBLIC_FIREBASE_APP_ID,
      storageBucket: `${process.env.PUBLIC_FIREBASE_APP_ID}.appspot.com`,
      messagingSenderId: process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
    };
    // Initialize Firebase
    const app = isEmpty(getApps()) ? initializeApp(firebaseConfig) : getApp();
    if (await isSupported()) {
      analytics = getAnalytics(app);
      initializePerformance(app);
    }
  }
}

void initAnalytics();

// eslint-disable-next-line import/prefer-default-export
export async function logAnalyticsEvent(
  event: string,
  eventParameters?: {
    [key: string]: unknown;
  },
): Promise<void> {
  if (
    process.env.NODE_ENV === 'production' &&
    analytics &&
    (await isSupported())
  ) {
    logEvent(analytics, event, eventParameters);
  } else {
    // eslint-disable-next-line no-console
    console.debug(event, eventParameters);
  }
}
