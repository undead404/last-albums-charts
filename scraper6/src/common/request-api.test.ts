import { Effect } from 'effect';

import requestApi from './request-api.js';

const EXAMPLE_URL = 'https://api.example.com/data';

describe('requestApi', () => {
  it('successful API response', async () => {
    const mockData = { some: 'data' };
    const mockResponse = new Response(JSON.stringify(mockData));

    jest
      .spyOn(global, 'fetch')
      .mockImplementation()
      .mockResolvedValueOnce(mockResponse);

    const result = await Effect.runPromise(requestApi(EXAMPLE_URL));

    expect(result).toEqual(mockData);
  });

  it('network error', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockImplementation()
      .mockRejectedValueOnce(new Error('Network error'));

    try {
      await Effect.runPromise(requestApi(EXAMPLE_URL));
    } catch (error) {
      expect(error).toMatchInlineSnapshot(
        `[(FiberFailure) Error: {"_tag":"ApiResponseError"}]`,
      );
    }
  });

  it('jSON parsing error', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockImplementation()
      .mockResolvedValueOnce(new Response('invalid json'));

    try {
      await Effect.runPromise(requestApi(EXAMPLE_URL));
    } catch (error) {
      expect(error).toMatchInlineSnapshot(
        `[(FiberFailure) Error: {"_tag":"ApiJsonError"}]`,
      );
    }
  });

  it('validation error', async () => {
    const mockData = '"Invalid data"';
    const mockResponse = new Response(JSON.stringify(mockData));

    jest
      .spyOn(global, 'fetch')
      .mockImplementation()
      .mockResolvedValueOnce(mockResponse);

    try {
      await Effect.runPromise(requestApi(EXAMPLE_URL));
    } catch (error) {
      expect(error).toMatchInlineSnapshot(
        `[(FiberFailure) Error: {"_tag":"ApiObjectError"}]`,
      );
    }
  });
});
