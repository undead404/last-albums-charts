START TRANSACTION;

CREATE OR REPLACE FUNCTION before_album_tag_change() RETURNS trigger
  LANGUAGE plpgsql AS $$
DECLARE
  album_weight FLOAT;
BEGIN
  album_weight := (SELECT "weight" from "public"."Album" WHERE "artist" = NEW."albumArtist" AND "name" = NEW."albumName");
  NEW."weight" := album_weight * POWER(NEW."count" / 100, 3);
  RETURN NEW;
END;$$;

DROP TRIGGER IF EXISTS before_album_tag_change ON "public"."AlbumTag";
DROP TRIGGER IF EXISTS before_album_tag_insert ON "public"."AlbumTag";
DROP TRIGGER IF EXISTS before_album_tag_update ON "public"."AlbumTag";

CREATE TRIGGER before_album_tag_insert
  BEFORE INSERT ON "public"."AlbumTag"
  FOR EACH ROW
  EXECUTE PROCEDURE before_album_tag_change();

CREATE TRIGGER before_album_tag_update
  BEFORE UPDATE ON "public"."AlbumTag"
  FOR EACH ROW
  WHEN (
    OLD."count" IS DISTINCT FROM NEW."count"
  )
  EXECUTE PROCEDURE before_album_tag_change();

COMMIT;
