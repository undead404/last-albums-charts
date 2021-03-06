import { Link, Router } from '@reach/router';
import { Skeleton } from 'antd';
import React, { Suspense } from 'react';
import { addPrefetchExcludes, Head, Root, Routes } from 'react-static';

import useRedirectHttps from './hooks/use-redirect-https';
import GlobalStyle from './GlobalStyle';

// Any routes that start with 'dynamic' will be treated as non-static routes
addPrefetchExcludes(['dynamic']);

const FALLBACK = <Skeleton />;

function App(): JSX.Element {
  useRedirectHttps();
  return (
    <Root>
      <GlobalStyle />
      <Head>
        <title>You Must Hear</title>
        <meta content="You Must Hear" name="title" />
        <meta
          content="Albums you must hear before you die"
          name="description"
        />

        {/* <!-- Open Graph / Facebook --> */}
        <meta content="website" property="og:type" />
        <meta content="https://undead404.neocities.org" property="og:url" />
        <meta content="You Must Hear" property="og:title" />
        <meta
          content="Albums you must hear before you die"
          property="og:description"
        />

        {/* <!-- Twitter --> */}
        <meta content="summary_large_image" property="twitter:card" />
        <meta content="https://undead404.neocities.org" property="twitter:url" />
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
        {process.env.NODE_ENV === 'production' && (
          <link rel="manifest" href="/manifest.json"></link>
        )}
        {process.env.NODE_ENV === 'production' && (
          <script src="/init-sw.js"></script>
        )}
      </Head>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/tag">Tags</Link>
      </nav>
      <div className="content">
        <Suspense fallback={FALLBACK}>
          <Router>
            <Routes path="*" />
          </Router>
        </Suspense>
      </div>
    </Root>
  );
}

export default App;
