# Atelier Platform

> Where creators work in public. A community built around work-based identity, process-first culture, and AI-powered matching.

## Stack
- **Next.js 14** (App Router) + TypeScript
- **Supabase** (database + auth)
- **Tailwind CSS**
- **Vercel** (deployment)

---

## Local Development Setup

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/atelier-platform.git
cd atelier-platform
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials from your Supabase project dashboard.

### 3. Set up Supabase database
Run this SQL in your Supabase SQL editor:

```sql
create table waitlist (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  source text default 'landing',
  signed_up_at timestamptz default now()
);

-- Enable RLS
alter table waitlist enable row level security;

-- Allow server-side inserts (service role bypasses RLS)
create policy "Service role can insert" on waitlist
  for insert with check (true);

-- Profiles table
create table profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade unique not null,
  username text unique not null,
  display_name text,
  role text,
  current_work text,
  skills text[],
  location text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Posts table
create table posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  type text default 'text', -- 'text', 'image', 'link'
  created_at timestamptz default now()
);

-- RLS for Profiles
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = user_id);

-- RLS for Posts
alter table posts enable row level security;
create policy "Posts are viewable by everyone" on posts for select using (true);
create policy "Authenticated users can create posts" on posts for insert with check (auth.uid() in (select user_id from profiles where id = author_id));
create policy "Users can delete own posts" on posts for delete using (auth.uid() in (select user_id from profiles where id = author_id));
```

### 4. Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables in Vercel dashboard (same as `.env.local`)
4. Deploy — auto-deploys on every push to `main`

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with waitlist signup |
| `/admin` | Password-protected waitlist dashboard |

---

## Roadmap

- [x] Phase 1 — Landing page + waitlist
- [x] Phase 2 — Supabase integration (emails saved to DB)
- [x] Phase 3 — Admin dashboard
- [x] Phase 4 — Auth + creator profiles + Feed
- [ ] Phase 5 — AI matching engine

---

Built with Claude + Jules + Vercel + Supabase.
