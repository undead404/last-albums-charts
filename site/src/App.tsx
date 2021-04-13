import { Link, Router } from '@reach/router';
import { Skeleton } from 'antd';
import React, { Suspense } from 'react';
import { Root, Routes, addPrefetchExcludes, Head } from 'react-static';

import './app.css';

// Any routes that start with 'dynamic' will be treated as non-static routes
addPrefetchExcludes(['dynamic']);

function App(): JSX.Element {
  return (
    <Root>
      <Head>
        <title>You Must Hear</title>
        <meta content="You Must Hear" name="title" />
        <meta
          content="Albums you must hear before you die"
          name="description"
        />

        {/* <!-- Open Graph / Facebook --> */}
        <meta content="website" property="og:type" />
        <meta content="https://you-must-hear.surge.sh" property="og:url" />
        <meta content="You Must Hear" property="og:title" />
        <meta
          content="Albums you must hear before you die"
          property="og:description"
        />

        {/* <!-- Twitter --> */}
        <meta content="summary_large_image" property="twitter:card" />
        <meta content="https://you-must-hear.surge.sh" property="twitter:url" />
        <meta content="You Must Hear" property="twitter:title" />
        <meta
          content="100 albums you must hear before you die"
          property="twitter:description"
        />
        <link href="https://img.discogs.com" rel="preconnect" />
        <link href="https://img.discogs.com" rel="dns-prefetch" />
        <link href="https://coverartarchive.org" rel="preconnect" />
        <link href="https://coverartarchive.org" rel="dns-prefetch" />
        <link
          href="/apple-touch-icon.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />
        <link
          href="/favicon-32x32.png"
          rel="icon"
          sizes="32x32"
          type="image/png"
        />
        <link
          href="/favicon-16x16.png"
          rel="icon"
          sizes="16x16"
          type="image/png"
        />
        <link href="/site.webmanifest" rel="manifest" />
      </Head>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/tag">Tags</Link>
      </nav>
      <div className="content">
        <Suspense fallback={<Skeleton />}>
          <Router>
            <Routes path="*" />
          </Router>
        </Suspense>
      </div>
    </Root>
  );
}

export default App;
