-- Let visitors remove stickers they placed. POST /api/stickers returns a secret token to the placer
-- and stores only its SHA-256 hash here; DELETE /api/stickers/:id deletes a row only when the token
-- it is sent hashes to this value. Stickers placed before this migration have no hash, so only the
-- admin token can remove them.
alter table public.stickers add column if not exists owner_hash text;

-- Keep the hash out of public reads: anon may select every column except owner_hash.
revoke select on public.stickers from anon;
grant select (id, x, y, k, r, n, created_at) on public.stickers to anon;
