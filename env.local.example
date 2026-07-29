-- Ascendo Immersive — starter schema.
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query).
--
-- This is intentionally minimal: just enough for Spotify to work. The real
-- data model (MAIN / MIND / BODY / ACADEMY / SIDES / PROFILE and their
-- sub-categories) comes once the core 3D interaction is confirmed to feel
-- right — no point designing those tables before that's settled.

create table if not exists spotify_connection (
  id int primary key default 1,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  scope text,
  updated_at timestamptz not null default now(),
  constraint spotify_connection_singleton check (id = 1)
);

alter table spotify_connection enable row level security;
