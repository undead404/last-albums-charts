export interface CoverArtArchiveResponse {
  images: {
    image: string;
    thumbnails: {
      small: string;
      large: string;
    };
    types: string[];
  }[];
}
