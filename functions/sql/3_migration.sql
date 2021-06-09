ALTER TABLE "public"."Album"
  ALTER COLUMN "artist" TYPE VARCHAR(2047);
ALTER TABLE "public"."Album"
  ALTER COLUMN "name" TYPE VARCHAR(2047);
ALTER TABLE "public"."Album"
  ALTER COLUMN "cover" TYPE VARCHAR(2047);
ALTER TABLE "public"."Album"
  ALTER COLUMN "thumbnail" TYPE VARCHAR(2047);

ALTER TABLE "public"."Tag"
  ALTER COLUMN "name" TYPE VARCHAR(2047);

ALTER TABLE "public"."AlbumTag"
  ALTER COLUMN "albumArtist" TYPE VARCHAR(2047);
ALTER TABLE "public"."AlbumTag"
  ALTER COLUMN "albumName" TYPE VARCHAR(2047);
ALTER TABLE "public"."AlbumTag"
  ALTER COLUMN "tagName" TYPE VARCHAR(2047);

ALTER TABLE "public"."TagListItem"
  ALTER COLUMN "albumArtist" TYPE VARCHAR(2047);
ALTER TABLE "public"."TagListItem"
  ALTER COLUMN "albumName" TYPE VARCHAR(2047);
ALTER TABLE "public"."TagListItem"
  ALTER COLUMN "tagName" TYPE VARCHAR(2047);


