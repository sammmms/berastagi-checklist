import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { GroupItem } from '../types';
import { DEFAULT_GROUP_ITEMS } from '../data/defaultItems';

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

  return {
    url: localUrl || envUrl || '',
    anonKey: localKey || envKey || '',
    isCustom: !!(localUrl && localKey),
  };
}

export function saveSupabaseCredentials(url: string, anonKey: string) {
  localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url.trim());
  localStorage.setItem(STORAGE_KEYS.SUPABASE_ANON_KEY, anonKey.trim());
  cachedClient = null; // reset cached instance
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

  // Generate initial list from defaults
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

export const SUPABASE_SQL_SCHEMA = `-- Jalankan SQL ini di menu "SQL Editor" pada dashboard Supabase kamu:

-- 1. Buat tabel daftar barang bersama
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

-- 3. Berikan izin akses penuh ke tabel untuk semua pengguna aplikasi trip
create policy "Allow public read" on trip_group_items for select using (true);
create policy "Allow public insert" on trip_group_items for insert with check (true);
create policy "Allow public update" on trip_group_items for update using (true);
create policy "Allow public delete" on trip_group_items for delete using (true);

-- 4. Aktifkan Realtime agar otomatis ter-update di layar HP semua orang
alter publication supabase_realtime add table trip_group_items;
`;
