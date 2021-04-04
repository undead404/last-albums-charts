import forEach from 'lodash/forEach';
import lunr from 'lunr';
import posts from './posts';

// eslint-disable-next-line
window['search'] = lunr(function() {
  this.ref('name');
  this.field('text');
  forEach(posts, (post) => {
    this.add(post);
  });
});
