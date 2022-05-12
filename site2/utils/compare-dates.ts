import { compareAsc } from 'date-fns';

export default function compareDates(d1: null | Date, d2: null | Date): number {
  if (!d1 && !d2) {
    return 0;
  }
  if (!d1) {
    return 1;
  }
  if (!d2) {
    return -1;
  }
  return compareAsc(d1, d2);
}
