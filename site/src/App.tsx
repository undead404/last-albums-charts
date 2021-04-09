import React from 'react';
import { Root, Routes, addPrefetchExcludes, Head } from 'react-static';
import { Link, Router } from '@reach/router';
import FancyDiv from 'components/FancyDiv';
import Dynamic from 'containers/Dynamic';
import './app.css';

// Any routes that start with 'dynamic' will be treated as non-static routes
addPrefetchExcludes(['dynamic']);

function App(): JSX.Element {
  return (
    <Root>
      <Head>
        <link href="https://img.discogs.com" rel="preconnect" />
        <link href="https://img.discogs.com" rel="dns-prefetch" />
        <link href="http://coverartarchive.org" rel="preconnect" />
        <link href="http://coverartarchive.org" rel="dns-prefetch" />
      </Head>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/dynamic">Dynamic</Link>
      </nav>
      <div className="content">
        <FancyDiv>
          <React.Suspense fallback={<em>Loading...</em>}>
            <Router>
              <Dynamic path="dynamic" />
              <Routes path="*" />
            </Router>
          </React.Suspense>
        </FancyDiv>
      </div>
    </Root>
  );
}

export default App;
