FROM postgres:14-alpine

ENV POSTGRES_PASSWORD lac

COPY ./schema.sql /tmp

RUN psql -U postgres -d postgres -a -f /tmp/schema.sql