import { readFile, writeFile } from 'node:fs/promises';

import { Canvas, Image as CanvasImage } from 'canvas';
import _ from 'lodash';

import fetchImage from './fetch-image.js';
import logger from './logger.js';
import sequentialAsyncForEach from './sequential-async-for-each.js';
import type { WithRequired } from './types.js';

const { isString, startsWith } = _;

export type ImageSource = Buffer | string | Canvas;

function getPhoto(source: ImageSource) {
  if (source instanceof Buffer) {
    return source;
  }
  if (isString(source)) {
    if (startsWith(source, 'http') || startsWith(source, 'ftp')) {
      return fetchImage(source).catch(() => {
        throw new Error(`Could not download url source: ${source}`);
      });
    }
    return readFile(source).catch(() => {
      throw new Error(`Could not load file source: ${source}`);
    });
  }
  if (source instanceof Canvas) {
    return source.toBuffer();
  }
  throw new Error(`Unsupported source type: ${source}`);
}

export interface CreateCollageOptions {
  backgroundColor?: string;
  height: number;
  imageHeight: number;
  imageWidth: number;
  lines?: unknown[];
  sources: (Buffer | Canvas | string)[];
  spacing?: number;
  textStyle?: { height?: number };
  width: number;
}

type FullCollageOptions = WithRequired<
  CreateCollageOptions,
  'backgroundColor' | 'spacing' | 'textStyle'
>;

export default async function createCollage(
  options: CreateCollageOptions,
  fileName: string,
) {
  logger.debug(
    // eslint-disable-next-line no-magic-numbers
    `createCollage(..., ${fileName})`,
  );
  try {
    const fullOptions: FullCollageOptions = {
      backgroundColor: '#eeeeee',
      lines: [],
      spacing: 0,
      textStyle: { height: 0, ...options?.textStyle },
      ...options,
    };

    const canvasWidth =
      fullOptions.width * fullOptions.imageWidth +
      (fullOptions.width - 1) * fullOptions.spacing;
    const canvasHeight =
      fullOptions.height * fullOptions.imageHeight +
      (fullOptions.height - 1) * fullOptions.spacing +
      (fullOptions.textStyle.height || 0);
    const canvas = new Canvas(canvasWidth, canvasHeight);

    const context = canvas.getContext('2d');
    context.fillStyle = fullOptions.backgroundColor;
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    const { height, imageHeight, imageWidth, sources, spacing, width } =
      fullOptions;
    const maxImages = width * height;

    await sequentialAsyncForEach(
      sources,
      async (source: ImageSource, index) => {
        const photoBuffer = await getPhoto(source);

        if (index >= maxImages) return;

        const img = new CanvasImage();
        img.src = photoBuffer;

        const x = (index % width) * (imageWidth + spacing);
        const y = Math.floor(index / width) * (imageHeight + spacing);
        context.drawImage(img, x, y, imageWidth, imageHeight);
      },
    );
    await writeFile(fileName, canvas.toBuffer('image/jpeg'), { flag: 'w' });
  } catch (error) {
    logger.error(`createCollage: ${error}`);
  }
}
