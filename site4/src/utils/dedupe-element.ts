import forEach from 'lodash/forEach';
import take from 'lodash/take';

export default async function dedupeElement(
  container: ShadowRoot | null,
  selector: string,
  maxInclusions = 1,
) {
  if (!container) {
    return;
  }
  const elements = container.querySelectorAll(selector);
  const duplicates = take(elements, elements.length - maxInclusions);
  forEach(duplicates, (duplicate) => duplicate.remove());
}
