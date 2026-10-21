-- ====================================================================
-- SUPABASE UNIFIED MIGRATION SCRIPT
-- PROYEK: BERASTAGI CHECKLIST (bts_cl_) & TOV'S FLEUR (tovs_fleur_)
-- Jalankan query ini di menu "SQL Editor" pada Supabase dashboard kamu:
-- (https://ahxfeflxhpkxyfitarpn.supabase.co)
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. BTS CHECKLIST (PREFIX: bts_cl_)
-- --------------------------------------------------------------------

create table if not exists public.bts_cl_group_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Lainnya',
  pic_name text default null,
  is_completed boolean default false,
  checked_by text default null,
  notes text default null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Aktifkan RLS
alter table public.bts_cl_group_items enable row level security;

-- Policies untuk akses publik
drop policy if exists "Allow public read" on public.bts_cl_group_items;
create policy "Allow public read" on public.bts_cl_group_items for select using (true);

drop policy if exists "Allow public insert" on public.bts_cl_group_items;
create policy "Allow public insert" on public.bts_cl_group_items for insert with check (true);

drop policy if exists "Allow public update" on public.bts_cl_group_items;
create policy "Allow public update" on public.bts_cl_group_items for update using (true);

drop policy if exists "Allow public delete" on public.bts_cl_group_items;
create policy "Allow public delete" on public.bts_cl_group_items for delete using (true);

-- Aktifkan Realtime
alter publication supabase_realtime add table public.bts_cl_group_items;


-- --------------------------------------------------------------------
-- 2. TOV'S FLEUR (PREFIX: tovs_fleur_)
-- --------------------------------------------------------------------

-- Jika tabel invoices lama ada, rename ke tovs_fleur_invoices:
do $$
begin
  if exists (select from pg_tables where schemaname = 'public' and tablename = 'invoices') then
    alter table public.invoices rename to tovs_fleur_invoices;
  end if;
end $$;

-- Jika tabel tovs_fleur_invoices belum ada, buat baru:
create table if not exists public.tovs_fleur_invoices (
  id text primary key,
  invoice_number text not null,
  order_date text not null,
  payment_date text,
  payment_method text not null default 'Transfer Bank (BCA)',
  payment_status text not null default 'LUNAS',
  customer_name text not null,
  customer_gender text not null default 'Laki-Laki',
  customer_phone text,
  recipient_name text not null,
  recipient_gender text not null default 'Perempuan',
  product_name text not null,
  flower_type text not null default 'Artificial',
  size text not null default 'M',
  color_scheme text,
  notes text,
  greeting_card text,
  items jsonb not null default '[]'::jsonb,
  total_amount numeric not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Aktifkan RLS & Policies
alter table public.tovs_fleur_invoices enable row level security;

drop policy if exists "Enable all access for anon" on public.tovs_fleur_invoices;
create policy "Enable all access for anon" on public.tovs_fleur_invoices
  for all using (true) with check (true);

-- Aktifkan Realtime
alter publication supabase_realtime add table public.tovs_fleur_invoices;

-- View backwards-compatibility (agar kode atau webhook lama tetap aman):
create or replace view public.invoices as
  select * from public.tovs_fleur_invoices;
