import { Layout, PageHeader } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import type { ReactNode } from 'react';
import styled from 'styled-components';

import goBack from '../utils/go-back';

export interface HeaderProperties {
  avatar?: { src: string };
  children?: ReactNode;
  extra?: ReactNode;
  pageTitle?: string;
  renderedAt?: string;
  url: string;
}

const Navigation = styled.nav`
  display: flex;
  gap: 0.5rem;
`;

const LayoutHeader = styled(Layout.Header)`
  height: auto;
  background-color: transparent;
`;

const NAVIGATION = (
  <Navigation>
    <Link href="/">Home</Link>
    <Link href="/about">About</Link>
    <Link href="/tags">Tags</Link>
  </Navigation>
);
export default function Header({
  avatar,
  children,
  pageTitle,
  renderedAt,
  url,
}: HeaderProperties): JSX.Element {
  const title = pageTitle ? `${pageTitle} | You Must Hear` : 'You Must Hear';
  return (
    <>
      <Head>
        <title>{title}</title>
        {/* <!-- Primary Meta Tags --> */}
        {/* <!-- Twitter --> */}
        <meta content="summary_large_image" property="twitter:card" />
        <meta content={url} property="twitter:url" />
        <meta content={title} property="twitter:title" />
        <meta
          content="100 albums you must hear before you die"
          property="twitter:description"
        />
        {avatar?.src && <meta content={avatar.src} property="twitter:image" />}
        {avatar?.src && <meta content={avatar.src} property="og:image" />}
        {renderedAt && <meta content={renderedAt} httpEquiv="date" />}
        {renderedAt && <meta content={renderedAt} httpEquiv="last-modified" />}
      </Head>
      <LayoutHeader>
        <PageHeader
          avatar={avatar}
          extra={NAVIGATION}
          ghost={false}
          onBack={goBack}
          subTitle="100 albums to hear before you die"
          title={title}
        />
        {children}
      </LayoutHeader>
    </>
  );
}
