create table if not exists public.stickers (
  id uuid primary key default gen_random_uuid(),
  x numeric not null check (x between 12 and 88),
  y numeric not null check (y between 10 and 90),
  k smallint not null check (k between 0 and 7),
  r numeric not null check (r between -15 and 15),
  n varchar(40) not null default '',
  created_at timestamptz not null default now()
);

alter table public.stickers enable row level security;

revoke all on public.stickers from anon, authenticated;
grant select, insert on public.stickers to anon;

drop policy if exists "Anyone can read stickers" on public.stickers;
create policy "Anyone can read stickers" on public.stickers for select to anon using (true);

drop policy if exists "Anyone can add valid stickers" on public.stickers;
create policy "Anyone can add valid stickers" on public.stickers for insert to anon
with check (x between 12 and 88 and y between 10 and 90 and k between 0 and 7 and r between -15 and 15 and char_length(n) <= 40);
