import classNames from 'classnames';
import { useCallback, useState } from 'react';

import SearchWidget from './search-widget';

export default function Navigation() {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const toggleIsBurgerOpen = useCallback(
    () => setIsBurgerOpen((oldValue) => !oldValue),
    [],
  );
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          You Must Hear
        </a>

        <a
          role="button"
          className={classNames('navbar-burger', { 'is-active': isBurgerOpen })}
          aria-label="menu"
          aria-expanded="false"
          onClick={toggleIsBurgerOpen}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div className={classNames('navbar-menu', { 'is-active': isBurgerOpen })}>
        <div className="navbar-start">
          <a className="navbar-item is-primary" href="/tags/1">
            <strong>Tags</strong>
          </a>
          <a className="navbar-item" href="/">
            Best of all
          </a>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <strong className="search-prompt">Search tags:</strong>
            <SearchWidget />
          </div>
          <a className="navbar-item" href="/about">
            About
          </a>
          <div className="navbar-item"></div>
        </div>
      </div>
    </nav>
  );
}
