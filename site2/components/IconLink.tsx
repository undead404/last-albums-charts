import { Button } from 'antd';
import React, { ReactNode } from 'react';

import stopPropagation from '../utils/stop-propagation';

export interface IconLinkProperties {
  icon: ReactNode;
  url: string;
}

export default function IconLink({
  icon,
  url,
}: IconLinkProperties): JSX.Element {
  return (
    <Button
      href={url}
      icon={icon}
      onClick={stopPropagation}
      shape="circle"
      target="_blank"
      title="Last.fm"
      type="link"
    />
  );
}
