-- AfriFacts closed-testing signups (/afrifacts)
-- Run once in the Supabase SQL editor.

create table if not exists public.afrifacts_testers (
  id          uuid primary key default gen_random_uuid(),
  email       text        not null unique,
  source      text,
  created_at  timestamptz not null default now(),
  invited_at  timestamptz
);

create index if not exists afrifacts_testers_created_at_idx
  on public.afrifacts_testers (created_at desc);

-- Locked down: the site writes with the service-role key, which bypasses RLS.
-- With RLS on and no policies, the public anon key can neither read nor write.
alter table public.afrifacts_testers enable row level security;


-- ─── Handy queries ──────────────────────────────────────────────────────────

-- Emails still waiting for an invite, newline-separated, ready to paste into
-- Play Console → Closed testing → Testers:
--   select string_agg(email, chr(10) order by created_at)
--   from public.afrifacts_testers where invited_at is null;

-- After you've added them in Play Console and sent the opt-in link:
--   update public.afrifacts_testers set invited_at = now() where invited_at is null;

-- Where signups are coming from:
--   select coalesce(source, 'direct') as source, count(*)
--   from public.afrifacts_testers group by 1 order by 2 desc;
