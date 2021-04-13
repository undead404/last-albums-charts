import { Button } from 'antd';
import React, { MouseEvent, ReactNode, useCallback } from 'react';

export interface IconLinkProperties {
  icon: ReactNode;
  url: string;
}

export default function IconLink({
  icon,
  url,
}: IconLinkProperties): JSX.Element {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => event.stopPropagation(),
    [],
  );
  return (
    <Button
      href={url}
      icon={icon}
      onClick={handleClick}
      shape="circle"
      target="_blank"
      title="Last.fm"
      type="link"
    ></Button>
  );
}
