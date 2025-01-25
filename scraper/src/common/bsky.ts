import { type AppBskyFeedPost, AtpAgent } from '@atproto/api';

import getAlbumTitle from './get-album-title.js';
import logger from './logger.js';
import { Album } from './types.js';

const agent = new AtpAgent({ service: 'https://bsky.social' });

async function getImageAsUint8Array(url: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    // Read the file as Uint8Array directly from the blob
    const buffer = await blob.arrayBuffer();
    return new Uint8Array(buffer);
  } catch (error) {
    logger.error('Error fetching image:', error);
    return null;
  }
}

export default async function postToBsky(text: string, imageUrl?: string) {
  try {
    await agent.login({
      identifier: process.env.BSKY_USERNAME!,
      password: process.env.BSKY_PASSWORD!,
    });

    const post: Partial<AppBskyFeedPost.Record> = {
      text,
    };

    if (imageUrl) {
      const imageData = await getImageAsUint8Array(imageUrl);
      if (imageData) {
        const testUpload = await agent.uploadBlob(imageData, {
          encoding: 'image/jpg',
        });
        post.embed = {
          $type: 'app.bsky.embed.images',
          images: [
            {
              image: testUpload.data.blob,
              alt: '',
            },
          ],
        };
      }
    }

    await agent.post(post);
  } catch {
    logger.error(`Failed to post to Bsky: ${text}`);
  }
}

export function postAlbumToBsky(album: Album, tagName: string) {
  const title = `${getAlbumTitle(album)}\n\n#${tagName.replaceAll(' ', '_')}`;
  return postToBsky(title, album.cover || undefined);
}
