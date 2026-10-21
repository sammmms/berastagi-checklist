import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { GroupItem } from '../types';
import { DEFAULT_GROUP_ITEMS } from '../data/defaultItems';

export const TABLE_NAME = 'bts_cl_group_items';

const DEFAULT_CREDENTIALS = {
  url: 'https://ahxfeflxhpkxyfitarpn.supabase.co',
  anonKey: 'sb_publishable_4B_NhAHs7HK8MAn9S9K0Vg_cbl0oKX8',
};

const STORAGE_KEYS = {
  SUPABASE_URL: 'trip_supabase_url',
  SUPABASE_ANON_KEY: 'trip_supabase_anon_key',
  USER_NAME: 'trip_user_name',
  LOCAL_GROUP_ITEMS: 'trip_group_items_fallback',
};

let cachedClient: SupabaseClient | null = null;

export function getSupabaseCredentials() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  const localUrl = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || '';
  const localKey = localStorage.getItem(STORAGE_KEYS.SUPABASE_ANON_KEY) || '';

  const finalUrl = localUrl || envUrl || DEFAULT_CREDENTIALS.url;
  const finalKey = localKey || envKey || DEFAULT_CREDENTIALS.anonKey;

  return {
    url: finalUrl,
    anonKey: finalKey,
    isCustom: !!(localUrl && localKey),
  };
}

export function saveSupabaseCredentials(url: string, anonKey: string) {
  localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url.trim());
  localStorage.setItem(STORAGE_KEYS.SUPABASE_ANON_KEY, anonKey.trim());
  cachedClient = null;
}

export function clearSupabaseCredentials() {
  localStorage.removeItem(STORAGE_KEYS.SUPABASE_URL);
  localStorage.removeItem(STORAGE_KEYS.SUPABASE_ANON_KEY);
  cachedClient = null;
}

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey) return null;

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
      },
    });
    return cachedClient;
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return null;
  }
}

export function getUserName(): string {
  return localStorage.getItem(STORAGE_KEYS.USER_NAME) || '';
}

export function saveUserName(name: string): void {
  localStorage.setItem(STORAGE_KEYS.USER_NAME, name.trim());
}

// Fallback helper for local storage
export function getLocalFallbackItems(): GroupItem[] {
  const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_GROUP_ITEMS);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // ignore
    }
  }

  const initial: GroupItem[] = DEFAULT_GROUP_ITEMS.map((item, idx) => ({
    id: `item-${idx + 1}`,
    ...item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  saveLocalFallbackItems(initial);
  return initial;
}

export function saveLocalFallbackItems(items: GroupItem[]): void {
  localStorage.setItem(STORAGE_KEYS.LOCAL_GROUP_ITEMS, JSON.stringify(items));
}

export const SUPABASE_SQL_SCHEMA = `-- ====================================================================
-- BERASTAGI CHECKLIST (BTS-CL) & TOV'S FLEUR MIGRATION SCRIPT
-- Jalankan di SQL Editor pada Supabase (https://ahxfeflxhpkxyfitarpn.supabase.co)
-- ====================================================================

-- --------------------------------------------------------------------
-- BAGIAN 1: BTS CHECKLIST (PREFIX: bts_cl_)
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

alter table public.bts_cl_group_items enable row level security;

drop policy if exists "Allow public read" on public.bts_cl_group_items;
create policy "Allow public read" on public.bts_cl_group_items for select using (true);

drop policy if exists "Allow public insert" on public.bts_cl_group_items;
create policy "Allow public insert" on public.bts_cl_group_items for insert with check (true);

drop policy if exists "Allow public update" on public.bts_cl_group_items;
create policy "Allow public update" on public.bts_cl_group_items for update using (true);

drop policy if exists "Allow public delete" on public.bts_cl_group_items;
create policy "Allow public delete" on public.bts_cl_group_items for delete using (true);

alter publication supabase_realtime add table public.bts_cl_group_items;

-- --------------------------------------------------------------------
-- BAGIAN 2: TOV'S FLEUR (PREFIX: tovs_fleur_)
-- --------------------------------------------------------------------

-- Jika tabel invoices lama sudah ada, rename ke tovs_fleur_invoices:
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

alter table public.tovs_fleur_invoices enable row level security;

drop policy if exists "Enable all access for anon" on public.tovs_fleur_invoices;
create policy "Enable all access for anon" on public.tovs_fleur_invoices
  for all using (true) with check (true);

alter publication supabase_realtime add table public.tovs_fleur_invoices;

-- Buat view backwards-compatibility untuk query lama:
create or replace view public.invoices as
  select * from public.tovs_fleur_invoices;
`;
