import * as v from 'valibot';

export const coverArtArchiveResponseSchema = v.object({
  images: v.array(
    v.object({
      front: v.boolean(),
      image: v.string(),
      thumbnails: v.object({
        large: v.string(),
        small: v.string(),
      }),
    }),
  ),
});

export type CoverArtArchiveResponse = v.InferInput<
  typeof coverArtArchiveResponseSchema
>;
