ALTER TABLE "public"."Album"
  DROP COLUMN "weight" CASCADE;
ALTER TABLE "public"."Tag"
  DROP COLUMN "power" CASCADE;

ALTER TABLE "public"."AlbumTag"
  DROP COLUMN "weight" CASCADE;

DROP TRIGGER IF EXISTS after_album_insert ON "public"."Album";
DROP TRIGGER IF EXISTS before_album_change ON "public"."Album";
DROP TRIGGER IF EXISTS last_item_updated ON "public"."Album";
DROP TRIGGER IF EXISTS before_album_insert ON "public"."Album";
DROP TRIGGER IF EXISTS before_album_update ON "public"."Album";

DROP TRIGGER IF EXISTS before_album_tag_change ON "public"."AlbumTag";
DROP TRIGGER IF EXISTS before_album_tag_insert ON "public"."AlbumTag";
DROP TRIGGER IF EXISTS before_album_tag_update ON "public"."AlbumTag";
