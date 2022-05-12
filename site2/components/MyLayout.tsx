import { BackTop, Layout } from 'antd';
import type { ReactNode } from 'react';

export interface MyLayoutProperties {
  children: ReactNode;
  header?: ReactNode;
}

export default function MyLayout({
  children,
  header,
}: MyLayoutProperties): JSX.Element {
  return (
    <>
      {header}
      <Layout.Content>{children}</Layout.Content>
      <BackTop />
    </>
  );
}
