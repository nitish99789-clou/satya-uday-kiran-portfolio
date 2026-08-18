
create or replace function public.is_admin()
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

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$ begin new.updated_at = now(); return new; end; $$;

-- PROFILE (singleton)
create table public.profile (
  id uuid primary key default gen_random_uuid(),
  full_name text not null default 'Uday Kiran',
  hero_intro text not null default 'Hi, I''m',
  hero_line1 text not null default 'VIDEO EDITOR',
  hero_line2_a text not null default '& VISUAL',
  hero_line2_b text not null default 'STORYTELLER',
  hero_description text not null default 'I transform raw footage into cinematic stories that captivate, engage, and leave a lasting impact.',
  about_eyebrow text not null default 'WHO I AM',
  about_heading text not null default 'Crafting Emotion Through Every Frame',
  about_bio text not null default 'I''m a passionate video editor with an eye for detail and a love for storytelling. I help brands, creators, and businesses bring their ideas to life through cinematic visuals.',
  work_heading text not null default 'Stories I''ve Brought to Life',
  contact_heading text not null default 'Let''s Create Something Amazing',
  contact_description text not null default 'Have a project in mind? Let''s collaborate and turn your ideas into visual stories.',
  email text not null default 'hello@udaykiran.com',
  phone text not null default '+91 12345 67890',
  location text not null default 'Hyderabad, India',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.profile to anon;
grant select, insert, update, delete on public.profile to authenticated;
grant all on public.profile to service_role;
alter table public.profile enable row level security;
create policy "profile public read" on public.profile for select using (true);
create policy "profile admin write" on public.profile for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger profile_updated before update on public.profile for each row execute function public.set_updated_at();

-- PROJECTS
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Commercial',
  subtitle text not null default '',
  description text not null default '',
  thumbnail_url text,
  video_url text,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.projects to anon;
grant select, insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "projects public read published" on public.projects for select using (published = true);
create policy "projects admin read all" on public.projects for select to authenticated using (public.is_admin());
create policy "projects admin write" on public.projects for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger projects_updated before update on public.projects for each row execute function public.set_updated_at();

-- SERVICES
create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  icon text not null default 'Film',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.services to anon;
grant select, insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "services public read" on public.services for select using (true);
create policy "services admin write" on public.services for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger services_updated before update on public.services for each row execute function public.set_updated_at();

-- EXPERIENCE
create table public.experience (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text not null default '',
  period text not null default '',
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.experience to anon;
grant select, insert, update, delete on public.experience to authenticated;
grant all on public.experience to service_role;
alter table public.experience enable row level security;
create policy "experience public read" on public.experience for select using (true);
create policy "experience admin write" on public.experience for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger experience_updated before update on public.experience for each row execute function public.set_updated_at();

-- SOCIAL LINKS
create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  url text not null default '#',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.social_links to anon;
grant select, insert, update, delete on public.social_links to authenticated;
grant all on public.social_links to service_role;
alter table public.social_links enable row level security;
create policy "social public read" on public.social_links for select using (true);
create policy "social admin write" on public.social_links for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger social_updated before update on public.social_links for each row execute function public.set_updated_at();

-- STATISTICS
create table public.statistics (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null default '',
  icon text not null default 'Star',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.statistics to anon;
grant select, insert, update, delete on public.statistics to authenticated;
grant all on public.statistics to service_role;
alter table public.statistics enable row level security;
create policy "stats public read" on public.statistics for select using (true);
create policy "stats admin write" on public.statistics for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger statistics_updated before update on public.statistics for each row execute function public.set_updated_at();

-- SEED
insert into public.profile default values;

insert into public.statistics (label, value, icon, sort_order) values
  ('Years Experience', '3+', 'CalendarCheck', 1),
  ('Projects Completed', '150+', 'Clapperboard', 2),
  ('Happy Clients', '80+', 'Heart', 3),
  ('Awards Won', '10+', 'Trophy', 4);

insert into public.social_links (platform, url, sort_order) values
  ('Instagram', 'https://instagram.com', 1),
  ('YouTube', 'https://youtube.com', 2),
  ('LinkedIn', 'https://linkedin.com', 3);

insert into public.services (title, description, icon, sort_order) values
  ('Film Editing', 'Cinematic cuts, pacing and color for short films and narratives.', 'Film', 1),
  ('Commercial Edits', 'Punchy brand promos built to convert and stop the scroll.', 'Megaphone', 2),
  ('Motion Graphics', 'Titles, transitions and animated elements in After Effects.', 'Sparkles', 3),
  ('Color Grading', 'DaVinci Resolve grading that sets the mood of every frame.', 'Palette', 4);

insert into public.experience (role, company, period, description, sort_order) values
  ('Senior Video Editor', 'Freelance', '2023 — Present', 'Editing commercials, music videos and travel films for brands and creators worldwide.', 1),
  ('Video Editor', 'Studio Collective', '2022 — 2023', 'Delivered weekly branded content and social campaigns end to end.', 2),
  ('Junior Editor', 'Frameworks Media', '2021 — 2022', 'Assisted on post-production, motion graphics and asset management.', 3);

insert into public.projects (title, subtitle, category, description, video_url, published, sort_order) values
  ('CINEMATIC SHORT FILM', 'Film Editing', 'Short Film', 'A moody cinematic short cut and graded end to end.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', true, 1),
  ('BRAND PROMO', 'Commercial', 'Commercial', 'High-energy automotive brand promo for a night city campaign.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', true, 2),
  ('MUSIC VIDEO', 'Entertainment', 'Music Video', 'Neon-lit music video with rhythmic cuts and heavy grading.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', true, 3),
  ('TRAVEL VLOG', 'YouTube Content', 'Travel', 'Mountain travel vlog with cinematic pacing and sound design.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', true, 4);
