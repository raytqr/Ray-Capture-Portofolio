-- Run this in the Supabase SQL Editor to enable the 'About Me' feature

-- 1. Create the 'content' table for storing About Me text and image
create table if not exists public.content (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  section text unique not null, -- e.g. 'about', 'contact', 'hero' (useful for future)
  title text,
  body text,
  image_url text
);

-- 2. Enable RLS (Security)
alter table public.content enable row level security;

-- 3. Create Policies for 'content' table

-- Allow PUBLIC to READ content (so the website can show it)
create policy "Allow Public Select Content"
on public.content for select
to public
using (true);

-- Allow PUBLIC to INSERT/UPDATE/DELETE (Since you wanted simple admin without auth complexity for now)
-- Ideally this should be restricted to authenticated users only if you add login later.
create policy "Allow Public Manage Content"
on public.content for all
to public
using (true)
with check (true);

-- 4. Initial Seed Data for 'About Me' (Optional, prevents empty state)
insert into public.content (section, title, body, image_url)
values (
  'about', 
  'Hi, I am Ray!', 
  'I am a passionate photographer capturing moments that last a lifetime.', 
  'https://images.unsplash.com/photo-1554048612-387768052bf4?auto=format&fit=crop&q=80'
)
on conflict (section) do nothing;
