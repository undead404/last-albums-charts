import { useEffect } from 'react';

export default function useRedirectHttps(): void {
  useEffect(() => {
    /* eslint-disable no-restricted-globals */
    if (location.hostname !== 'localhost' && location.protocol !== 'https:') {
      // eslint-disable-next-line lodash/prefer-lodash-method
      location.replace(
        `https:${location.href.slice(location.protocol.length)}`,
      );
      /* eslint-enable no-restricted-globals */
    }
  }, []);
}
