import forEach from 'lodash/forEach';
import lunr from 'lunr';
import posts from './posts';

export default function initSearch(): void {
  // eslint-disable-next-line dot-notation
  window['search'] = lunr(function configure() {
    this.ref('name');
    this.field('text');
    forEach(posts, (post) => {
      this.add(post);
    });
  });
}
