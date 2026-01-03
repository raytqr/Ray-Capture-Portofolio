-- Run this in Supabase SQL Editor

-- 1. Fix Schema Types
-- If 'features' exists as jsonb (from previous errors), drop and recreate as text[]
do $$
begin
    if exists (
        select 1 
        from information_schema.columns 
        where table_name = 'pricing_packages' 
        and column_name = 'features' 
        and data_type = 'jsonb'
    ) then
        alter table public.pricing_packages drop column features;
    end if;
end $$;

-- 2. Create/Update Table and Columns
create table if not exists public.pricing_packages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  price_real text not null,
  price_fake text,
  description text,
  category text not null,
  is_popular boolean default false
);

-- Ensure correct column types exist
alter table public.pricing_packages add column if not exists features text[] default '{}';
alter table public.pricing_packages add column if not exists is_popular boolean default false;

-- 3. Security
alter table public.pricing_packages enable row level security;

drop policy if exists "Allow Public Select Pricing" on public.pricing_packages;
create policy "Allow Public Select Pricing"
on public.pricing_packages for select
to public
using (true);

drop policy if exists "Allow Public Manage Pricing" on public.pricing_packages;
create policy "Allow Public Manage Pricing"
on public.pricing_packages for all
to public
using (true)
with check (true);

-- 4. Seed Data
insert into public.pricing_packages (title, price_real, features, category, is_popular)
select 'Basic Graduation', 'Rp 500.000', ARRAY['1 Hour Session', '50 Edited Photos'], 'Graduation', false
where not exists (select 1 from public.pricing_packages where title = 'Basic Graduation');

insert into public.pricing_packages (title, price_real, features, category, is_popular)
select 'Premium Wedding', 'Rp 5.000.000', ARRAY['Full Day Coverage', 'All Files', 'Printed Album'], 'Wedding', true
where not exists (select 1 from public.pricing_packages where title = 'Premium Wedding');
