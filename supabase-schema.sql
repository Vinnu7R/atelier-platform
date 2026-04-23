-- ============================================================
-- ATELIER PLATFORM — SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. WAITLIST
create table if not exists waitlist (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  source text default 'landing',
  signed_up_at timestamptz default now()
);
alter table waitlist enable row level security;

-- 2. PROFILES
create table if not exists profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade unique not null,
  display_name text not null default '',
  username text unique not null default '',
  role text default '',
  tagline text default '',
  current_work text default '',
  about text default '',
  skills text[] default '{}',
  location text default 'Hyderabad, India',
  avatar_url text,
  website text,
  twitter text,
  github text,
  is_onboarded boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table profiles enable row level security;

-- Anyone can read profiles
create policy "Profiles are publicly readable"
  on profiles for select using (true);

-- Users can only update their own profile
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = user_id);

-- Users can insert their own profile
create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = user_id);

-- 3. POSTS
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references profiles(id) on delete cascade not null,
  type text check (type in ('update','question','milestone','reflection')) default 'update',
  title text,
  content text not null,
  tags text[] default '{}',
  likes_count integer default 0,
  replies_count integer default 0,
  created_at timestamptz default now()
);
alter table posts enable row level security;

-- Anyone can read posts
create policy "Posts are publicly readable"
  on posts for select using (true);

-- Authenticated users can post
create policy "Authenticated users can post"
  on posts for insert with check (
    auth.uid() = (select user_id from profiles where id = author_id)
  );

-- Authors can delete their posts
create policy "Authors can delete own posts"
  on posts for delete using (
    auth.uid() = (select user_id from profiles where id = author_id)
  );

-- 4. AUTO-CREATE PROFILE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, display_name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    lower(regexp_replace(split_part(new.email, '@', 1), '[^a-z0-9]', '_', 'g'))
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. UPDATE timestamp trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at();
