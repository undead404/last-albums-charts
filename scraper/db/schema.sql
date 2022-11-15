\set ON_ERROR_STOP on

CREATE TABLE IF NOT EXISTS "public"."Album" (
  artist VARCHAR(255) NOT NULL,
  cover VARCHAR(1023),
  "date" VARCHAR(10),
  duration INTEGER,
  "hidden" BOOLEAN DEFAULT false,
  listeners INTEGER,
  mbid VARCHAR(255),
  "name" VARCHAR(511) NOT NULL,
  "numberOfTracks" INTEGER,
  playcount INTEGER,
  "registeredAt" TIMESTAMP NOT NULL DEFAULT now(),
  "statsUpdatedAt" TIMESTAMP,
  "tagsUpdatedAt" TIMESTAMP,
  thumbnail VARCHAR(1023),
  PRIMARY KEY (artist, "name")
);

CREATE TABLE IF NOT EXISTS "public"."Tag" (
  "albumsScrapedAt" TIMESTAMP,
  "listCheckedAt" TIMESTAMP,
  "listUpdatedAt" TIMESTAMP,
  "name" VARCHAR(511) PRIMARY KEY NOT NULL,
  "registeredAt" TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "public"."AlbumTag" (
  "albumArtist" VARCHAR(255) NOT NULL,
  "albumName" VARCHAR(511) NOT NULL,
  CONSTRAINT album FOREIGN KEY ("albumArtist", "albumName") REFERENCES "public"."Album"(artist, "name") ON DELETE CASCADE,
  "tagName" VARCHAR(511) NOT NULL,
  CONSTRAINT tag FOREIGN KEY("tagName") REFERENCES "public"."Tag"("name") ON DELETE CASCADE,
  "count" INTEGER NOT NULL,
  PRIMARY KEY("albumArtist", "albumName", "tagName")
);

CREATE TABLE IF NOT EXISTS "public"."TagListItem" (
  "albumArtist" VARCHAR(255) NOT NULL,
  "albumName" VARCHAR(511) NOT NULL,
  CONSTRAINT album FOREIGN KEY ("albumArtist", "albumName") REFERENCES "public"."Album"(artist, "name") ON DELETE CASCADE,
  place INTEGER NOT NULL,
  "tagName" VARCHAR(511) NOT NULL,
  CONSTRAINT tag FOREIGN KEY("tagName") REFERENCES "public"."Tag"("name") ON DELETE CASCADE,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  PRIMARY KEY("tagName", place),
  UNIQUE("albumArtist", "albumName", "tagName")
);

CREATE FUNCTION tag_list_item_updated_at() RETURNS trigger
   LANGUAGE plpgsql AS
$$BEGIN
   NEW."updatedAt" := current_timestamp;
   RETURN NEW;
END;$$;

CREATE TRIGGER last_item_updated
   BEFORE INSERT OR UPDATE ON "public"."TagListItem"
   FOR EACH ROW
   EXECUTE PROCEDURE tag_list_item_updated_at();


INSERT INTO "public"."Tag"("albumsScrapedAt", "listCheckedAt", "listUpdatedAt", "name", "registeredAt") VALUES (NULL, NULL, NULL, 'ukrainian', now());

\unset ON_ERROR_STOP
