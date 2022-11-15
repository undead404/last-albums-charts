import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import endsWith from 'lodash/endsWith';
import filter from 'lodash/filter';
import map from 'lodash/map';
import startsWith from 'lodash/startsWith';
import without from 'lodash/without';

const TAGS_DATA_DIR = './data';

export async function getTagsNumberOfPages(): Promise<number> {
  const tagsFiles = await readdir(path.join(TAGS_DATA_DIR, 'tags-index'));
  return filter(
    tagsFiles,
    (tagsFileName) =>
      startsWith(tagsFileName, 'tags') && endsWith(tagsFileName, '.json'),
  ).length;
}

export async function getTagsPageData(pageNumber: number): Promise<unknown> {
  const fileContent = await readFile(
    path.join(TAGS_DATA_DIR, 'tags-index', `tags${pageNumber}.json`),
  );
  return JSON.parse(fileContent.toString());
}

export async function getTagInfo(tagName: string): Promise<unknown> {
  const fileContent = await readFile(
    path.join(TAGS_DATA_DIR, `${tagName}.json`),
  );
  return JSON.parse(fileContent.toString());
}

export async function getTags(): Promise<string[]> {
  const tagsFiles = await readdir(path.join(TAGS_DATA_DIR));
  return without(
    map(
      filter(tagsFiles, (tagFileName) => endsWith(tagFileName, '.json')),
      (tagFileName) =>
        tagFileName.slice(0, Math.max(0, tagFileName.length - '.json'.length)),
    ),
    'top-list',
  );
}
