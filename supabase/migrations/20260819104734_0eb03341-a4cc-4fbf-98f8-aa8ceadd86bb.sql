
create schema if not exists private;
grant usage on schema private to authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select lower(u.email) = 'satyauday0205@gmail.com' from auth.users u where u.id = auth.uid()),
    false
  );
$$;
revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to authenticated;

drop policy if exists "profile admin write" on public.profile;
create policy "profile admin write" on public.profile for all to authenticated using (private.is_admin()) with check (private.is_admin());

drop policy if exists "projects admin read all" on public.projects;
create policy "projects admin read all" on public.projects for select to authenticated using (private.is_admin());
drop policy if exists "projects admin write" on public.projects;
create policy "projects admin write" on public.projects for all to authenticated using (private.is_admin()) with check (private.is_admin());

drop policy if exists "services admin write" on public.services;
create policy "services admin write" on public.services for all to authenticated using (private.is_admin()) with check (private.is_admin());

drop policy if exists "experience admin write" on public.experience;
create policy "experience admin write" on public.experience for all to authenticated using (private.is_admin()) with check (private.is_admin());

drop policy if exists "social admin write" on public.social_links;
create policy "social admin write" on public.social_links for all to authenticated using (private.is_admin()) with check (private.is_admin());

drop policy if exists "stats admin write" on public.statistics;
create policy "stats admin write" on public.statistics for all to authenticated using (private.is_admin()) with check (private.is_admin());

drop policy if exists "thumbnails admin insert" on storage.objects;
create policy "thumbnails admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'thumbnails' and private.is_admin());
drop policy if exists "thumbnails admin update" on storage.objects;
create policy "thumbnails admin update" on storage.objects for update to authenticated using (bucket_id = 'thumbnails' and private.is_admin()) with check (bucket_id = 'thumbnails' and private.is_admin());
drop policy if exists "thumbnails admin delete" on storage.objects;
create policy "thumbnails admin delete" on storage.objects for delete to authenticated using (bucket_id = 'thumbnails' and private.is_admin());

drop function if exists public.is_admin();

create table public.profile_contact (
  id uuid primary key default gen_random_uuid(),
  email text not null default '',
  phone text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profile_contact to authenticated;
grant all on public.profile_contact to service_role;
alter table public.profile_contact enable row level security;
create policy "profile_contact admin only" on public.profile_contact for all to authenticated using (private.is_admin()) with check (private.is_admin());
create trigger profile_contact_updated before update on public.profile_contact for each row execute function public.set_updated_at();

insert into public.profile_contact (email, phone)
select p.email, p.phone from public.profile p limit 1;

alter table public.profile drop column email;
alter table public.profile drop column phone;

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);
grant insert on public.contact_messages to anon, authenticated;
grant select, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;
create policy "anyone can send a message" on public.contact_messages for insert to anon, authenticated with check (true);
create policy "admin reads messages" on public.contact_messages for select to authenticated using (private.is_admin());
create policy "admin deletes messages" on public.contact_messages for delete to authenticated using (private.is_admin());
