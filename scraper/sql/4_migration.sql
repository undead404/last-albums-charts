ALTER TABLE "public"."Album"
  ALTER COLUMN "artist" TYPE VARCHAR(4095);
ALTER TABLE "public"."Album"
  ALTER COLUMN "name" TYPE VARCHAR(4095);
ALTER TABLE "public"."Album"
  ALTER COLUMN "cover" TYPE VARCHAR(4095);
ALTER TABLE "public"."Album"
  ALTER COLUMN "thumbnail" TYPE VARCHAR(4095);

ALTER TABLE "public"."Tag"
  ALTER COLUMN "name" TYPE VARCHAR(4095);

ALTER TABLE "public"."AlbumTag"
  ALTER COLUMN "albumArtist" TYPE VARCHAR(4095);
ALTER TABLE "public"."AlbumTag"
  ALTER COLUMN "albumName" TYPE VARCHAR(4095);
ALTER TABLE "public"."AlbumTag"
  ALTER COLUMN "tagName" TYPE VARCHAR(4095);

ALTER TABLE "public"."TagListItem"
  ALTER COLUMN "albumArtist" TYPE VARCHAR(4095);
ALTER TABLE "public"."TagListItem"
  ALTER COLUMN "albumName" TYPE VARCHAR(4095);
ALTER TABLE "public"."TagListItem"
  ALTER COLUMN "tagName" TYPE VARCHAR(4095);


