import type { Album } from '../types';

let albumModal: HTMLElement | null = null;

export default function activateAlbum(album: Album): void {
  if (!albumModal) {
    albumModal = document.querySelector('.album-modal');
  }
  if (!albumModal) {
    throw new Error('album modal missing');
  }
  albumModal.dispatchEvent(
    new CustomEvent('activate-album', { detail: album }),
  );
}
