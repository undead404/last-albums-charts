import _ from 'lodash';

import type { Tag } from './lastfm/api-types.js';
import isTagBlacklisted from './is-tag-blacklisted.js';

const { keyBy, mapValues, max, pickBy, some, toLower, values } = _;

const DESIRED_MAX_TAG_COUNT = 100;

export default function normalizeTags(
  tagsObjects: readonly Tag[],
): Record<string, number> {
  let result = pickBy(
    mapValues(
      keyBy(tagsObjects, (tagObject) => toLower(tagObject.name)),
      'count',
    ),
    (tagCount, tagName) => !isTagBlacklisted(tagName),
  );

  if (!some(result, (tagCount) => tagCount === DESIRED_MAX_TAG_COUNT)) {
    const maxTagCount = max(values(result));

    if (!maxTagCount) {
      return {};
    }

    const correction = DESIRED_MAX_TAG_COUNT / maxTagCount;
    result = mapValues(result, (tagCount) => Math.floor(tagCount * correction));
  }
  result = mapValues(result, (tagCount) =>
    Math.floor((tagCount * tagCount) / DESIRED_MAX_TAG_COUNT),
  );
  result = pickBy(result, (tagCount) => tagCount > 0);
  return result;
}
