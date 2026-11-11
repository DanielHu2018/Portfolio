# Sticker persistence

The static mockup now calls `/api/stickers` when it loads and when a visitor places a sticker. The API uses Supabase Postgres and keeps the existing local seed/sticker visible if the API is unavailable.

## Setup

1. Create a Supabase project.
2. Run each file in `supabase/migrations/` in order in the Supabase SQL editor
   (`20261028000000_create_stickers.sql`, then `20261111000000_sticker_owner_hash.sql`).
3. Add these deployment environment variables:

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=server-only-secret
STICKER_ADMIN_TOKEN=a-long-random-admin-token
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code.

## Endpoints

- `GET /api/stickers`
- `POST /api/stickers`: returns the new sticker plus a one-time `token`
- `DELETE /api/stickers/:id` with either the `x-sticker-token` header (that sticker's token) or the `x-admin-token` header (any sticker)

The API validates sticker positions, sticker kind, rotation, and the 40-character note limit. The public database policy allows only reading and inserting valid stickers; deletion is server-side.

## Removing your own stickers

When a visitor places a sticker, `POST /api/stickers` generates a random token, stores only its SHA-256 hash in `owner_hash`, and returns the token once. The browser keeps tokens in `localStorage` (`dh-stickers`, by sticker id) and shows an × on those stickers. `DELETE` only removes a row whose `owner_hash` matches the token it's sent, answering 403 for someone else's sticker and 404 if it's already gone. Stickers placed before the `owner_hash` migration, or from another browser, can only be removed with the admin token. Until that migration runs, placing still works (the API saves without `owner_hash`), but no × appears.
