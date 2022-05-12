import { BackTop, Layout } from 'antd';
import type { AppProps } from 'next/app';
// import dynamic from 'next/dynamic';
import Head from 'next/head';
import { createGlobalStyle } from 'styled-components';

import FirebaseContextProvider from '../components/FirebaseContextProvider';

import 'antd/dist/antd.css';

const title = 'You Must Hear';
const url = `https://you-must-hear.firebaseapp.com`;

const GlobalStyle = createGlobalStyle`
html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}
`;

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <FirebaseContextProvider>
      <GlobalStyle />
      <Layout>
        <Head>
          <title>{title}</title>
          <meta content={title} name="title" />
          <meta
            content="100 albums you must hear before you die"
            name="description"
          />

          {/* <!-- Open Graph / Facebook --> */}
          <meta content="website" property="og:type" />
          <meta content={url} property="og:url" />
          <meta content={title} property="og:title" />
          <meta
            content="100 albums you must hear before you die"
            property="og:description"
          />
        </Head>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
        <BackTop />
      </Layout>
    </FirebaseContextProvider>
  );
}

export default MyApp;
