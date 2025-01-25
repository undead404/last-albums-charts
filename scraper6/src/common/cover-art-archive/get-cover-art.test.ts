import { Effect } from 'effect';

import requestApi from '../request-api.js';

import getCoverArtInfo from './get-cover-art.js';
import type { CoverArtArchiveResponse } from './schema.js';

jest.mock('../request-api.js');

describe('getCoverArtInfo', () => {
  const mockedRequestApi = jest.mocked(requestApi);

  // eslint-disable-next-line jest/no-hooks
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the parsed response on success', async () => {
    const mbid = '123456';
    const mockResponse = {
      images: [
        {
          front: true,
          image: 'image1.jpg',
          thumbnails: { large: 'large1.jpg', small: 'small1.jpg' },
        },
        // ... other images
      ],
    };
    const parsedResponse: CoverArtArchiveResponse = mockResponse;

    mockedRequestApi.mockReturnValue(Effect.succeed(mockResponse));
    // safeParse.mockReturnValue({ output: parsedResponse, success: true });

    const result = await Effect.runPromise(getCoverArtInfo(mbid));

    expect(result).toEqual(parsedResponse);
    expect(mockedRequestApi).toHaveBeenCalledWith(
      `https://coverartarchive.org/release/${mbid}`,
    );
  });

  // ... other tests (same as before)
});
