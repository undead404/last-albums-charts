import React, { ReactNode } from 'react';

export interface FancyDivProperties {
  children: ReactNode;
}

export default function FancyDiv({
  children,
}: FancyDivProperties): JSX.Element {
  return <div style={{ border: '1px solid red' }}>{children}</div>;
}
