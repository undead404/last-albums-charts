import { ReactNode, useMemo } from 'react';

import FirebaseContext, { IFirebaseContext } from '../contexts/firebase';

const logAnalyticsEvent: IFirebaseContext['logAnalyticsEvent'] =
  typeof window === 'undefined'
    ? // eslint-disable-next-line no-console
      console.info
    : // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../common/firebase.ts').logAnalyticsEvent;

export interface FirebaseContextProviderProperties {
  children: ReactNode;
}

export default function FirebaseContextProvider({
  children,
}: FirebaseContextProviderProperties): JSX.Element {
  const value = useMemo<IFirebaseContext>(
    () => ({
      logAnalyticsEvent,
    }),
    [],
  );
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}
