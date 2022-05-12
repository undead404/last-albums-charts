import type { TagsPageProperties } from '.';
import map from 'lodash/map';
import range from 'lodash/range';
import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

import getTagsPagesNumber from '../../common/get-tags-pages-number';
import openData from '../../common/open-data';
import type { SerializedTagForTagsPage } from '../../types';

export { default } from '.';

export async function getStaticProps(
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<TagsPageProperties>> {
  const page = Number.parseInt(context.params?.page as string, 10) || 1;
  return {
    props: {
      initialTags: (await openData(
        `tags-index/tags${page}`,
      )) as SerializedTagForTagsPage[],
      numberOfPages: await getTagsPagesNumber(),
      page,
    },
  };
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const numberOfPages = await getTagsPagesNumber();
  return {
    fallback: true,
    paths: map(range(1, numberOfPages + 1), (n) => ({
      params: {
        page: `${n}`,
      },
    })),
  };
}
