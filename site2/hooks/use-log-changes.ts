import { useEffect } from 'react';

export default function useLogChanges<T>(
  where: string,
  what: string,
  value: T,
): void {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.debug(where, what, value);
  }, [value, what, where]);
}
