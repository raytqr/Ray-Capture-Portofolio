-- Run this in the Supabase SQL Editor

-- 1. Create the 'portfolio' bucket (If it doesn't exist)
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- 2. (Skipped) Enable RLS on Storage Objects 
-- This is usually enabled by default and throws an error if we try to change it on system tables.

-- 3. DROP existing policies to avoid conflicts (Optional, but good for retry)
drop policy if exists "Allow Public Uploads" on storage.objects;
drop policy if exists "Allow Public Select" on storage.objects;
drop policy if exists "Allow Public Delete" on storage.objects;

-- 4. IZIN UPLOAD untuk semua orang (Public)
create policy "Allow Public Uploads"
on storage.objects for insert
to public
with check (bucket_id = 'portfolio');

-- 5. IZIN LIHAT/DOWNLOAD untuk semua orang
create policy "Allow Public Select"
on storage.objects for select
to public
using (bucket_id = 'portfolio');

-- 6. IZIN HAPUS untuk semua orang
create policy "Allow Public Delete"
on storage.objects for delete
to public
using (bucket_id = 'portfolio');

-- 7. Pastikan tabel database juga siap
create table if not exists public.portfolio_items (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text,
  category text,
  image_url text
);

-- 8. Izin Database (Insert, Select, Delete)
-- Drop old policies if they exist to avoid duplication errors
drop policy if exists "Allow Public Insert Items" on public.portfolio_items;
drop policy if exists "Allow Public Select Items" on public.portfolio_items;
drop policy if exists "Allow Public Delete Items" on public.portfolio_items;

create policy "Allow Public Insert Items" on public.portfolio_items for insert to public with check (true);
create policy "Allow Public Select Items" on public.portfolio_items for select to public using (true);
create policy "Allow Public Delete Items" on public.portfolio_items for delete to public using (true);
