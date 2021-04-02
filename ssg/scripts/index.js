const js = hexo.extend.helper.get('js').bind(hexo);
hexo.extend.injector.register(
  'head_begin',
  '<link rel="preconnect" href="https://img.discogs.com" /><link rel="dns-prefetch" href="https://img.discogs.com" /><link rel="preconnect" href="http://coverartarchive.org" /><link rel="dns-prefetch" href="http://coverartarchive.org" />',
);
hexo.extend.injector.register('head_begin', () => js('client/bundle.js'));
