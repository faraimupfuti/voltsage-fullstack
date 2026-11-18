-- Account types (individual / organisation), organisations, team seats and invites.
-- Run after 001 and 002. All writes to organisations, members and invites go through the functions below,
-- so seat limits and admin checks are enforced in the database and cannot be bypassed from the browser.
--
-- seat_limit defaults to 10 to match COMPANY_USERS in lib/plans.ts. To give one organisation an
-- extended arrangement, update that organisation's seat_limit directly.

alter table public.profiles add column if not exists account_type text
  check (account_type in ('individual', 'organisation'));

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 120),
  seat_limit int not null default 10 check (seat_limit between 1 and 1000),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- one organisation per user
create table if not exists public.org_members (
  org_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null unique references auth.users (id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

create table if not exists public.org_invites (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  email text not null check (email = lower(email)),
  invited_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (org_id, email)
);

alter table public.organizations enable row level security;
alter table public.org_members enable row level security;
alter table public.org_invites enable row level security;

create or replace function public.is_org_member(p_org uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.org_members where org_id = p_org and user_id = auth.uid())
$$;

drop policy if exists "members read their organisation" on public.organizations;
create policy "members read their organisation" on public.organizations
  for select to authenticated using (public.is_org_member(id));

drop policy if exists "users read their own membership" on public.org_members;
create policy "users read their own membership" on public.org_members
  for select to authenticated using (user_id = auth.uid());

-- org_invites has no policies on purpose: only the functions below can read or write it.

-- ───────── internal helper (not callable from the browser) ─────────
create or replace function public._create_org(p_uid uuid, p_name text) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_org uuid;
begin
  if exists (select 1 from public.org_members where user_id = p_uid) then
    raise exception 'in_org';
  end if;
  insert into public.organizations (name, created_by) values (btrim(p_name), p_uid) returning id into v_org;
  insert into public.org_members (org_id, user_id, role) values (v_org, p_uid, 'admin');
  update public.profiles set account_type = 'organisation' where id = p_uid;
  return v_org;
end $$;

-- ───────── sign-up trigger: reads account type and organisation name from the sign-up metadata ─────────
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_type text;
  v_org text;
begin
  v_type := case new.raw_user_meta_data->>'account_type'
              when 'organisation' then 'organisation'
              when 'individual' then 'individual'
              else null end;
  v_org := btrim(coalesce(new.raw_user_meta_data->>'org_name', ''));

  insert into public.profiles (id, full_name, country, terms_accepted_at, account_type)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'country',
    case when new.raw_user_meta_data ? 'terms_accepted_at' then now() end,
    v_type
  )
  on conflict (id) do nothing;

  if v_type = 'organisation' and char_length(v_org) between 2 and 120 then
    begin
      perform public._create_org(new.id, v_org);
    exception when others then
      null; -- never block a sign-up because of the organisation step
    end;
  end if;
  return new;
end $$;

-- ───────── functions called from the site ─────────

-- First-time completion for accounts that have no type yet (Google sign-ups, accounts created before this migration).
create or replace function public.complete_profile(p_type text, p_org_name text default '') returns void
language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'not_authenticated'; end if;
  update public.profiles
     set account_type = case when p_type = 'organisation' then 'organisation' else 'individual' end
   where id = v_uid and account_type is null;
  if p_type = 'organisation'
     and char_length(btrim(coalesce(p_org_name, ''))) between 2 and 120
     and not exists (select 1 from public.org_members where user_id = v_uid) then
    perform public._create_org(v_uid, p_org_name);
  end if;
end $$;

-- Create an organisation (also how an individual account switches to an organisation account).
create or replace function public.create_organisation(p_name text) returns void
language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'not_authenticated'; end if;
  if char_length(btrim(coalesce(p_name, ''))) not between 2 and 120 then raise exception 'invalid_name'; end if;
  perform public._create_org(v_uid, p_name);
end $$;

-- Join an organisation that invited this (verified) email address.
create or replace function public.claim_org_invites() returns void
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_email text;
  v_inv public.org_invites%rowtype;
begin
  if v_uid is null then return; end if;
  select lower(u.email) into v_email from auth.users u where u.id = v_uid and u.email_confirmed_at is not null;
  if v_email is null then return; end if;
  if exists (select 1 from public.org_members where user_id = v_uid) then return; end if;

  select * into v_inv from public.org_invites where email = v_email order by created_at limit 1;
  if not found then return; end if;
  if (select count(*) from public.org_members where org_id = v_inv.org_id)
       >= (select seat_limit from public.organizations where id = v_inv.org_id) then
    return;
  end if;

  insert into public.org_members (org_id, user_id, role) values (v_inv.org_id, v_uid, 'member');
  delete from public.org_invites where email = v_email;
  update public.profiles set account_type = 'organisation' where id = v_uid;
end $$;

-- Admin only: invite a colleague by email. Pending invites count towards the seat limit.
create or replace function public.invite_member(p_email text) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_org uuid;
  v_email text := lower(btrim(coalesce(p_email, '')));
begin
  select m.org_id into v_org from public.org_members m where m.user_id = v_uid and m.role = 'admin';
  if v_org is null then raise exception 'not_admin'; end if;
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'invalid_email'; end if;
  if exists (
    select 1 from public.org_members m join auth.users u on u.id = m.user_id
     where m.org_id = v_org and lower(u.email) = v_email
  ) then raise exception 'already_member'; end if;
  if (select count(*) from public.org_members where org_id = v_org)
     + (select count(*) from public.org_invites where org_id = v_org)
     >= (select seat_limit from public.organizations where id = v_org) then
    raise exception 'seats_full';
  end if;
  insert into public.org_invites (org_id, email, invited_by) values (v_org, v_email, v_uid)
  on conflict (org_id, email) do nothing;
end $$;

-- Admin only: remove a team member (they go back to an individual account).
create or replace function public.remove_member(p_user uuid) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_org uuid;
begin
  select m.org_id into v_org from public.org_members m where m.user_id = v_uid and m.role = 'admin';
  if v_org is null then raise exception 'not_admin'; end if;
  if p_user = v_uid then raise exception 'cannot_remove_self'; end if;
  delete from public.org_members where org_id = v_org and user_id = p_user;
  update public.profiles set account_type = 'individual' where id = p_user;
end $$;

create or replace function public.revoke_invite(p_id uuid) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_org uuid;
begin
  select m.org_id into v_org from public.org_members m where m.user_id = v_uid and m.role = 'admin';
  if v_org is null then raise exception 'not_admin'; end if;
  delete from public.org_invites where id = p_id and org_id = v_org;
end $$;

-- Admin only: team members and pending invites. Returns no rows for anyone else.
create or replace function public.org_roster()
returns table (kind text, id uuid, email text, full_name text, role text, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  with me as (
    select m.org_id from public.org_members m where m.user_id = auth.uid() and m.role = 'admin'
  )
  select 'member'::text, m.user_id, u.email::text, p.full_name::text, m.role::text, m.created_at
    from public.org_members m
    join auth.users u on u.id = m.user_id
    left join public.profiles p on p.id = m.user_id
   where m.org_id in (select org_id from me)
  union all
  select 'invite'::text, i.id, i.email::text, null::text, 'member'::text, i.created_at
    from public.org_invites i
   where i.org_id in (select org_id from me)
  order by 1, 6
$$;

-- ───────── permissions ─────────
revoke all on function public._create_org(uuid, text) from public, anon, authenticated;
revoke all on function
  public.complete_profile(text, text), public.create_organisation(text), public.claim_org_invites(),
  public.invite_member(text), public.remove_member(uuid), public.revoke_invite(uuid), public.org_roster(),
  public.is_org_member(uuid)
  from public, anon;
grant execute on function
  public.complete_profile(text, text), public.create_organisation(text), public.claim_org_invites(),
  public.invite_member(text), public.remove_member(uuid), public.revoke_invite(uuid), public.org_roster(),
  public.is_org_member(uuid)
  to authenticated;
