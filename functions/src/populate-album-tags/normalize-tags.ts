import keyBy from 'lodash/keyBy';
import mapValues from 'lodash/mapValues';
import max from 'lodash/max';
import pickBy from 'lodash/pickBy';
import some from 'lodash/some';
import toLower from 'lodash/toLower';
import values from 'lodash/values';

import isTagBlacklisted from '../common/is-tag-blacklisted';
import { Tag } from '../common/lastfm/api-types';

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
  return result;
}
