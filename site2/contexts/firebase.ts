import noop from 'lodash/noop';
import { createContext } from 'react';

export interface IFirebaseContext {
  logAnalyticsEvent: (
    eventName: string,
    eventData: {
      [key: string]: unknown;
    },
  ) => void;
}

const FirebaseContext = createContext({
  logAnalyticsEvent: noop,
});

export default FirebaseContext;
