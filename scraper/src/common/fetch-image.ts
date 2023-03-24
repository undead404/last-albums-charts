import axios from 'axios';

const IMAGE_TIMEOUT = 10_000;

export default async function fetchImage(uri: string): Promise<Buffer> {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => controller.abort(), IMAGE_TIMEOUT);
  const response = await axios.get(uri, {
    responseType: 'arraybuffer',
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  return Buffer.from(response.data, 'binary');
}
