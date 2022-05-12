import { Spin } from 'antd';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  position: relative;
  width: 100%;
`;

interface CoverProperties {
  cover?: string;
}

const Cover = styled.div<CoverProperties>`
  background-image: url('${(properties) =>
    encodeURI(properties.cover || 'https://via.placeholder.com/300')}');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  height: 300px;
  max-width: 100%;
  width: 300px;
  z-index: 1;
`;

const CoverSpin = styled(Spin)`
  position: absolute;
  top: 50%;
`;

export interface AlbumImageProperties {
  image?: string;
}

export default function AlbumImage({
  image,
}: AlbumImageProperties): JSX.Element {
  return (
    <Wrapper>
      <Cover cover={image} />
      <CoverSpin spinning />
    </Wrapper>
  );
}
