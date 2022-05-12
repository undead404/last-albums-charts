START TRANSACTION;

CREATE OR REPLACE FUNCTION after_album_change() RETURNS trigger
  LANGUAGE plpgsql AS $$
DECLARE
  album_tag "public"."AlbumTag"%ROWTYPE;
BEGIN
  FOR album_tag IN
    (SELECT * FROM "public"."AlbumTag" WHERE "albumArtist" = NEW."artist" AND "albumName" = NEW."name")
  LOOP
    UPDATE "public"."AlbumTag" SET "weight" = NEW."weight"::FLOAT * POWER(album_tag."count"::FLOAT / 100, 3) WHERE "albumName" = album_tag."albumName" AND "albumArtist" = album_tag."albumArtist" AND "tagName" = album_tag."tagName";
  END LOOP;
  RETURN NEW;
END;$$;

DROP TRIGGER IF EXISTS after_album_insert ON "public"."Album";

CREATE TRIGGER after_album_insert
  AFTER INSERT ON "public"."Album"
  FOR EACH ROW
  EXECUTE PROCEDURE after_album_change();

DROP TRIGGER IF EXISTS after_album_update ON "public"."Album";

CREATE TRIGGER after_album_update
  AFTER UPDATE ON "public"."Album"
  FOR EACH ROW
  WHEN (
    OLD."weight" IS DISTINCT FROM NEW."weight"
  )
  EXECUTE PROCEDURE after_album_change();

COMMIT;
