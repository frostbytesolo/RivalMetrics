-- ============================================================================
-- RivalMetrics — Supabase schema with Row-Level Security + real-time aggregation
-- ============================================================================
-- This schema powers real, live analytics. There are no seed rows and no
-- fake data — every number on the site is computed from real visitor events.
--
-- Run this in the Supabase SQL editor. The app works without it (everything
-- shows honest "collecting data" states), but this is the production backend.
-- ============================================================================

-- Enable the pgcrypto extension for gen_random_uuid()
create extension if not exists pgcrypto;

-- ─── events: raw validated event stream ───────────────────────────────────
-- Every real visit becomes one row here, written by /api/log after anti-fake
-- checks pass. Rows are purged after 30 days by the daily rollup.
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  visitor_id  text not null,                  -- daily-rotating SHA-256 hash
  dimension   text not null check (dimension in ('countries','devices','os','browsers','regions')),
  bucket      text not null,                  -- the value being ranked (e.g. 'US', 'chrome', 'mobile')
  country     text,                            -- ISO country code, nullable
  device      text not null check (device in ('mobile','desktop','tablet','tv','wearable','other')),
  os          text not null check (os in ('android','windows','ios','macos','linux','chromeos','other')),
  browser     text not null check (browser in ('chrome','safari','edge','firefox','opera','samsung','other')),
  created_at  timestamptz not null default now()
);

create index if not exists events_dim_bucket_created_idx
  on public.events (dimension, bucket, created_at desc);
create index if not exists events_created_at_idx
  on public.events (created_at desc);
create index if not exists events_visitor_created_idx
  on public.events (visitor_id, created_at desc);

-- ─── daily_aggregates: precomputed per-day counts ─────────────────────────
-- Written by the rollup function. The leaderboard API reads from here for
-- historical periods; the real-time endpoint reads straight from events.
create table if not exists public.daily_aggregates (
  id          uuid primary key default gen_random_uuid(),
  day         date not null,
  dimension   text not null check (dimension in ('countries','devices','os','browsers','regions')),
  bucket      text not null,
  total       integer not null default 0,
  unique_visitors integer not null default 0,
  unique constraint daily_aggregates_uniq unique (day, dimension, bucket)
);

create index if not exists daily_aggregates_dim_day_idx
  on public.daily_aggregates (dimension, day desc, total desc);

-- ─── contact_messages: from the contact form ──────────────────────────────
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text not null default 'General',
  message     text not null,
  handled     boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists contact_messages_created_idx
  on public.contact_messages (created_at desc);

-- ─── donations: transparent, on-chain verified ────────────────────────────
create table if not exists public.donations (
  id           uuid primary key default gen_random_uuid(),
  tx_hash      text not null unique,
  coin         text not null,
  amount_usd   numeric(10, 2) not null,
  contributor  text,
  confirmed_at timestamptz not null default now()
);

create index if not exists donations_confirmed_idx
  on public.donations (confirmed_at desc);

-- ─── feed_events: derived movement events for the live feed ───────────────
-- Written by the rollup when a bucket's rank changes. Lets the live feed
-- surface real overtakes/milestones without recomputing history each poll.
create table if not exists public.feed_events (
  id          uuid primary key default gen_random_uuid(),
  at          timestamptz not null default now(),
  dimension   text not null check (dimension in ('countries','devices','os','browsers','regions')),
  bucket      text not null,
  kind        text not null check (kind in ('overtake','surge','milestone','drop')),
  message     text not null
);

create index if not exists feed_events_at_idx
  on public.feed_events (at desc);

-- ============================================================================
-- Row-Level Security
-- ============================================================================
-- Public (anon) can only read published aggregates, donations, and feed.
-- All writes happen exclusively via the service-role key on the server.
-- ============================================================================

alter table public.events            enable row level security;
alter table public.daily_aggregates  enable row level security;
alter table public.contact_messages  enable row level security;
alter table public.donations         enable row level security;
alter table public.feed_events       enable row level security;

-- Public read on aggregates (the leaderboards)
drop policy if exists "public read daily_aggregates" on public.daily_aggregates;
create policy "public read daily_aggregates"
  on public.daily_aggregates for select
  to anon, authenticated
  using (true);

-- Public read on donations (transparent counter)
drop policy if exists "public read donations" on public.donations;
create policy "public read donations"
  on public.donations for select
  to anon, authenticated
  using (true);

-- Public read on feed events (live movement feed)
drop policy if exists "public read feed_events" on public.feed_events;
create policy "public read feed_events"
  on public.feed_events for select
  to anon, authenticated
  using (true);

-- Events: no public access at all. Only service-role can insert.
drop policy if exists "no public events" on public.events;
create policy "no public events"
  on public.events for all
  to anon, authenticated
  using (false);

-- Contact messages: no public access. Service-role only.
drop policy if exists "no public contact" on public.contact_messages;
create policy "no public contact"
  on public.contact_messages for all
  to anon, authenticated
  using (false);

-- ============================================================================
-- Real-time aggregation functions (RPC)
-- ============================================================================
-- These compute live counts directly from the events table. They power the
-- real-time leaderboard and stats endpoints without waiting for the daily
-- rollup. The service-role key is required to call them (security definer).
-- ============================================================================

-- Real-time leaderboard: top N buckets for a dimension within a time window.
create or replace function public.realtime_leaderboard(
  p_dimension text,
  p_since timestamptz,
  p_limit int default 50
)
returns table (
  bucket text,
  total bigint,
  unique_visitors bigint
)
language sql
security definer
as $$
  select
    bucket,
    count(*)::bigint as total,
    count(distinct visitor_id)::bigint as unique_visitors
  from public.events
  where dimension = p_dimension
    and created_at >= p_since
  group by bucket
  order by total desc
  limit p_limit;
$$;

-- Real-time total counts for the stats endpoint.
create or replace function public.realtime_stats(
  p_since timestamptz
)
returns table (
  total_events bigint,
  unique_visitors bigint,
  active_countries bigint
)
language sql
security definer
as $$
  select
    count(*)::bigint as total_events,
    count(distinct visitor_id)::bigint as unique_visitors,
    count(distinct case when dimension = 'countries' then bucket end)::bigint as active_countries
  from public.events
  where created_at >= p_since;
$$;

-- Recent feed events for the live feed.
create or replace function public.recent_feed(
  p_limit int default 20
)
returns setof public.feed_events
language sql
security definer
as $$
  select * from public.feed_events
  order by at desc
  limit p_limit;
$$;

-- ============================================================================
-- Maintenance: daily rollup + purge
-- ============================================================================

-- Aggregate the day's events into daily_aggregates. Run via pg_cron daily.
create or replace function public.rollup_daily(target_day date default current_date)
returns void
language plpgsql
security definer
as $$
declare
  v_bucket text;
  v_total int;
  v_unique int;
  v_prev_rank int;
  v_curr_rank int;
  v_prev_bucket text;
  v_dim text;
begin
  for v_dim in select unnest(array['countries','devices','os','browsers']) loop
    -- Upsert today's aggregates.
    insert into public.daily_aggregates (day, dimension, bucket, total, unique_visitors)
    select
      target_day,
      v_dim,
      e.bucket,
      count(*),
      count(distinct e.visitor_id)
    from public.events e
    where e.dimension = v_dim
      and date_trunc('day', e.created_at) = target_day::timestamptz
    group by e.bucket
    on conflict (day, dimension, bucket) do update
      set total = excluded.total,
          unique_visitors = excluded.unique_visitors;

    -- Detect overtakes: compare today's rank order to yesterday's.
    for v_bucket, v_curr_rank in
      select da.bucket, row_number() over (order by da.total desc)
      from public.daily_aggregates da
      where da.dimension = v_dim and da.day = target_day
    loop
      select bucket into v_prev_bucket
      from public.daily_aggregates
      where dimension = v_dim and day = target_day - 1
      order by total desc
      limit 1 offset v_curr_rank - 1;

      if v_prev_bucket is not null and v_prev_bucket <> v_bucket then
        insert into public.feed_events (dimension, bucket, kind, message)
        values (v_dim, v_bucket, 'overtake', v_bucket || ' took #' || v_curr_rank || ' in ' || v_dim);
      end if;
    end loop;
  end loop;

  -- Purge raw events older than 30 days.
  delete from public.events where created_at < now() - interval '30 days';

  -- Purge feed events older than 7 days.
  delete from public.feed_events where at < now() - interval '7 days';

  -- Purge contact messages older than 90 days.
  delete from public.contact_messages where created_at < now() - interval '90 days';
end;
$$;
