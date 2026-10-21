-- ====================================================================
-- SUPABASE SQL SCHEMA: TRIP BERASTAGI CHECKLIST BERSAMA
-- Jalankan query ini di menu "SQL Editor" pada dashboard Supabase kamu.
-- ====================================================================

-- 1. Buat tabel untuk menyimpan daftar barang bawaan bersama
create table if not exists trip_group_items (
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

-- 2. Aktifkan Row Level Security (RLS)
alter table trip_group_items enable row level security;

-- 3. Kebijakan akses (Policies) agar semua anggota rombongan bisa membaca & memperbarui
drop policy if exists "Allow public read" on trip_group_items;
create policy "Allow public read" on trip_group_items for select using (true);

drop policy if exists "Allow public insert" on trip_group_items;
create policy "Allow public insert" on trip_group_items for insert with check (true);

drop policy if exists "Allow public update" on trip_group_items;
create policy "Allow public update" on trip_group_items for update using (true);

drop policy if exists "Allow public delete" on trip_group_items;
create policy "Allow public delete" on trip_group_items for delete using (true);

-- 4. Aktifkan fitur Realtime agar perubahan status langsung terlihat di HP anggota lain tanpa reload
alter publication supabase_realtime add table trip_group_items;

-- Selesai! Tabel siap digunakan oleh aplikasi web.
