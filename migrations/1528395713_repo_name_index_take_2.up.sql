BEGIN;
CREATE INDEX CONCURRENTLY IF NOT EXISTS repo_name_idx ON public.repo USING btree (lower(name::text) COLLATE pg_catalog."C");
COMMIT;
