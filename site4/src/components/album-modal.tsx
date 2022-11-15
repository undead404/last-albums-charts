import classNames from 'classnames';
import map from 'lodash/map';
import toPairs from 'lodash/toPairs';

import type { Album } from '../types';
import formatAlbum from '../utils/format-album';

export interface AlbumModalProperties {
  album: null | Album;
  onClose: () => void;
}

const HSL_SATURATION_CEILING = 101;
const GOLD_TAG_TEXT_CHANGE_BORDER = 75;
const BLACK_TAG_TEXT_CHANGE_BORDER = 50;

export default function AlbumModal({ album, onClose }: AlbumModalProperties) {
  return (
    <div className={classNames('modal', { 'is-active': !!album })}>
      <div className="modal-background" onClick={onClose}></div>

      <div className="modal-card">
        <header className="modal-card-head">
          {album && <p className="modal-card-title">{formatAlbum(album)}</p>}
          <button
            className="delete"
            aria-label="close"
            onClick={onClose}
          ></button>
        </header>
        <section className="modal-card-body">
          {album?.cover && (
            <p className="image is-1by1">
              <img src={album.cover} alt="Cover art" />
            </p>
          )}
          {album?.places && (
            <p className="m-1 tags">
              Places:{' '}
              {map(toPairs(album.places), ([tagName, place]) => (
                <a
                  className="tag is-black"
                  href={`/tag/${encodeURIComponent(tagName)}`}
                  key={`${tagName} #${place}`}
                  style={{
                    backgroundColor: `hsl(51, ${
                      HSL_SATURATION_CEILING - place
                    }%, 50%)`,
                    color:
                      place >= GOLD_TAG_TEXT_CHANGE_BORDER ? 'white' : 'black',
                  }}
                >
                  {tagName} #{place}
                </a>
              ))}
            </p>
          )}
          {album?.tags && (
            <p className="m-1 tags">
              Tags:{' '}
              {map(toPairs(album.tags), ([tagName, value]) => (
                <a
                  className="tag is-black"
                  href={`/tag/${encodeURIComponent(tagName)}`}
                  key={tagName}
                  style={{
                    backgroundColor: `hsl(0, 0%, ${
                      HSL_SATURATION_CEILING - value
                    }%)`,
                    color:
                      value > BLACK_TAG_TEXT_CHANGE_BORDER ? 'white' : 'black',
                  }}
                >
                  {`${value}% ${tagName}`}
                </a>
              ))}
            </p>
          )}
        </section>

        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}
