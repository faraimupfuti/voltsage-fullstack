-- Records when a user accepted the Terms of Service and Fair Use Policy at registration.
-- The sign-up form sends `terms_accepted_at` in the user metadata; the timestamp stored here is
-- the SERVER's now(), not the browser's, so it can't be back-dated by a client.
alter table public.profiles add column if not exists terms_accepted_at timestamptz;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, country, terms_accepted_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'country',
    case when new.raw_user_meta_data ? 'terms_accepted_at' then now() end
  )
  on conflict (id) do nothing;
  return new;
end $$;
