import { Image, Layout, List, Typography } from 'antd';
import React from 'react';
import { useRouteData } from 'react-static';
import { Album, Tag } from 'types';

function renderListItem(album: Album, index: number) {
  return (
    <List.Item
      extra={
        <Image src={album.thumbnail || 'https://via.placeholder.com/150'} />
      }
    >
      {index + 1}. {album.artist} - {album.name} ({album.date})
    </List.Item>
  );
}

export default function TagPage(): JSX.Element {
  const { tag }: { tag: Tag } = useRouteData();

  return (
    <Layout>
      <Layout.Header>
        <Typography.Title>{tag.name}</Typography.Title>
      </Layout.Header>
      <Layout.Content>
        <List dataSource={tag.topAlbums} renderItem={renderListItem} />
      </Layout.Content>
    </Layout>
  );
}
