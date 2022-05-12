import { MouseEvent } from 'react';

export default function stopPropagation<T extends HTMLElement>(
  event?: MouseEvent<T>,
): void {
  if (event) {
    event.stopPropagation();
  }
}
