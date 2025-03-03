import getAlbumTagCount from './get-album-tag-count.js';

jest.mock('./get-album-top-tags');

describe('getAlbumTagCount', () => {
  it('calculates', async () => {
    const tagCount = await getAlbumTagCount(
      'Tempo of the Damned',
      'Exodus',
      'thrash metal',
    );

    expect(tagCount).toBe(100);
  });
  it('returns zero on typo', async () => {
    const tagCount = await getAlbumTagCount(
      'Tempo of the Damned',
      'Exodu',
      'thrash metal',
    );

    expect(tagCount).toBe(0);
  });
});
