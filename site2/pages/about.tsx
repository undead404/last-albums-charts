import formatISO from 'date-fns/formatISO';
import type { GetStaticPropsResult } from 'next';
import { useMemo } from 'react';

import Header from '../components/Header';
import MyLayout from '../components/MyLayout';

export interface AboutProperties {
  renderedAt: string;
}

export default function About({ renderedAt }: AboutProperties): JSX.Element {
  const header = useMemo(
    () => (
      <Header
        pageTitle="About"
        renderedAt={renderedAt}
        url="https://you-must-hear.firebaseapp.com/about"
      />
    ),
    [renderedAt],
  );
  return (
    <MyLayout header={header}>You Must Hear by Vitalii Perehonchuk.</MyLayout>
  );
}

export function getStaticProps(): GetStaticPropsResult<AboutProperties> {
  return {
    props: {
      renderedAt: formatISO(new Date()),
    },
  };
}
