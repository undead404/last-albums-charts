START TRANSACTION;

CREATE OR REPLACE FUNCTION before_album_change() RETURNS trigger
  LANGUAGE plpgsql AS $$
DECLARE
  number_of_tracks INTEGER := COALESCE(NEW."numberOfTracks", 11);
BEGIN
  NEW."weight" := (
    (COALESCE(NEW."playcount", 0)::FLOAT / number_of_tracks) *
    COALESCE(NEW."listeners", 0) *
    (COALESCE(NEW."duration", 2731) / number_of_tracks)
  );
  RETURN NEW;
END;$$;

DROP TRIGGER IF EXISTS before_album_change ON "public"."Album";
DROP TRIGGER IF EXISTS last_item_updated ON "public"."Album";
DROP TRIGGER IF EXISTS before_album_insert ON "public"."Album";
DROP TRIGGER IF EXISTS before_album_update ON "public"."Album";

CREATE TRIGGER before_album_insert
  BEFORE INSERT ON "public"."Album"
  FOR EACH ROW
  EXECUTE PROCEDURE before_album_change();

CREATE TRIGGER before_album_update
  BEFORE UPDATE ON "public"."Album"
  FOR EACH ROW
  WHEN (
    OLD."playcount" IS DISTINCT FROM NEW."playcount" OR
    OLD."listeners" IS DISTINCT FROM NEW."listeners" OR
    OLD."numberOfTracks" IS DISTINCT FROM NEW."numberOfTracks" OR
    OLD."duration" IS DISTINCT FROM NEW."duration"
  )
  EXECUTE PROCEDURE before_album_change();

COMMIT;
