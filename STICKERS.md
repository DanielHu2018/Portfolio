# Sticker persistence

The static mockup now calls `/api/stickers` when it loads and when a visitor places a sticker. The API uses Supabase Postgres and keeps the existing local seed/sticker visible if the API is unavailable.

## Setup

1. Create a Supabase project.
2. Run `supabase/migrations/20261028000000_create_stickers.sql` in the Supabase SQL editor.
3. Add these deployment environment variables:

```text
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=server-only-secret
STICKER_ADMIN_TOKEN=a-long-random-admin-token
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code.

## Endpoints

- `GET /api/stickers`
- `POST /api/stickers`
- `DELETE /api/stickers/:id` with the `x-admin-token` header

The API validates sticker positions, sticker kind, rotation, and the 40-character note limit. The public database policy allows only reading and inserting valid stickers; deletion is server-side and admin-token protected.
