export interface PersonalItem {
  id: string;
  title: string;
  isCompleted: boolean;
  category?: string;
  notes?: string;
}

export interface GroupItem {
  id: string;
  title: string;
  category: 'BBQ & Masak' | 'Makanan & Bumbu' | 'Minuman & Snack' | 'Logistik Villa' | 'Hiburan & Obat' | 'Lainnya';
  picName?: string | null;
  isCompleted: boolean;
  checkedBy?: string | null;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type CategoryType = GroupItem['category'] | 'Semua';

export const TRIP_MEMBERS = [
  'Sam',
  'Shanly',
  'Raymond',
  'Pincek',
  'Jay',
  'Usman',
  'Justin',
  'Angela',
  'Jessy',
  'Citra',
] as const;

export type TripMember = typeof TRIP_MEMBERS[number];
