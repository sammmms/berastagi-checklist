import React, { useState, useEffect, useCallback } from 'react';
import { GroupItem, CategoryType, TRIP_MEMBERS } from '../types';
import { DEFAULT_GROUP_ITEMS } from '../data/defaultItems';
import {
  getSupabaseClient,
  getLocalFallbackItems,
  saveLocalFallbackItems,
  TABLE_NAME,
} from '../lib/supabase';
import {
  Check,
  Plus,
  Search,
  Filter,
  UserCheck,
  AlertCircle,
  Sparkles,
  Database,
  RefreshCw,
  Trash2,
  Tag,
  Flame,
  UtensilsCrossed,
  Wine,
  Home,
  Music,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GroupTabProps {
  userName: string;
  onRequireUserName: () => void;
  onUpdateProgress: (completed: number, total: number) => void;
  onOpenSupabaseModal: () => void;
  isSupabaseConnected: boolean;
}

const CATEGORIES: CategoryType[] = [
  'Semua',
  'BBQ & Masak',
  'Makanan & Bumbu',
  'Minuman & Snack',
  'Logistik Villa',
  'Hiburan & Obat',
];

export const GroupTab: React.FC<GroupTabProps> = ({
  userName,
  onRequireUserName,
  onUpdateProgress,
  onOpenSupabaseModal,
  isSupabaseConnected,
}) => {
  const [items, setItems] = useState<GroupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Semua');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unassigned' | 'pending' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // New item form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GroupItem['category']>('BBQ & Masak');
  const [newPic, setNewPic] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Fetch items from Supabase or Local Fallback
  const fetchItems = useCallback(async () => {
    setIsSyncing(true);
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from(TABLE_NAME)
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped: GroupItem[] = data.map((row) => ({
            id: row.id,
            title: row.title,
            category: row.category,
            picName: row.pic_name,
            isCompleted: row.is_completed,
            checkedBy: row.checked_by,
            notes: row.notes,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          }));
          setItems(mapped);
          saveLocalFallbackItems(mapped);
        } else {
          // If remote table is completely empty, use local items or prompt seed
          const local = getLocalFallbackItems();
          setItems(local);
        }
      } catch (err) {
        console.warn('Error fetching from Supabase, using local fallback:', err);
        setItems(getLocalFallbackItems());
      }
    } else {
      setItems(getLocalFallbackItems());
    }

    setLoading(false);
    setIsSyncing(false);
  }, []);

  // Realtime subscription setup
  useEffect(() => {
    fetchItems();

    const supabase = getSupabaseClient();
    if (!supabase) return;

    const channel = supabase
      .channel('group_items_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE_NAME },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchItems]);

  // Update progress
  useEffect(() => {
    const completed = items.filter((i) => i.isCompleted).length;
    onUpdateProgress(completed, items.length);

    if (items.length > 0 && completed === items.length) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 },
      });
    }
  }, [items, onUpdateProgress]);

  // Check / Toggle item completion
  const handleToggleComplete = async (item: GroupItem) => {
    if (!userName) {
      onRequireUserName();
      return;
    }

    const nextState = !item.isCompleted;
    const nextCheckedBy = nextState ? userName : null;

    // Optimistic UI update
    const updatedItems = items.map((i) =>
      i.id === item.id
        ? {
            ...i,
            isCompleted: nextState,
            checkedBy: nextCheckedBy,
            updatedAt: new Date().toISOString(),
          }
        : i
    );
    setItems(updatedItems);
    saveLocalFallbackItems(updatedItems);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from(TABLE_NAME)
          .update({
            is_completed: nextState,
            checked_by: nextCheckedBy,
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id);
      } catch (err) {
        console.warn('Failed to update Supabase:', err);
      }
    }
  };

  // Claim responsibility (Saya yang bawa)
  const handleClaimPic = async (item: GroupItem, customPic?: string) => {
    if (!userName && !customPic) {
      onRequireUserName();
      return;
    }

    const assignedTo = customPic !== undefined ? customPic : userName;

    const updatedItems = items.map((i) =>
      i.id === item.id
        ? {
            ...i,
            picName: assignedTo || null,
            updatedAt: new Date().toISOString(),
          }
        : i
    );
    setItems(updatedItems);
    saveLocalFallbackItems(updatedItems);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase
          .from(TABLE_NAME)
          .update({
            pic_name: assignedTo || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id);
      } catch (err) {
        console.warn('Failed to update PIC in Supabase:', err);
      }
    }
  };

  // Add new item
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItemData = {
      title: newTitle.trim(),
      category: newCategory,
      pic_name: newPic.trim() || null,
      is_completed: false,
      checked_by: null,
      notes: newNotes.trim() || null,
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from(TABLE_NAME)
          .insert([newItemData])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          const mapped: GroupItem = {
            id: data.id,
            title: data.title,
            category: data.category,
            picName: data.pic_name,
            isCompleted: data.is_completed,
            checkedBy: data.checked_by,
            notes: data.notes,
          };
          setItems((prev) => [...prev, mapped]);
        }
      } catch (err) {
        console.warn('Failed to insert into Supabase, saving locally:', err);
        const localItem: GroupItem = {
          id: `custom-g-${Date.now()}`,
          title: newTitle.trim(),
          category: newCategory,
          picName: newPic.trim() || null,
          isCompleted: false,
          checkedBy: null,
          notes: newNotes.trim() || null,
        };
        const updated = [...items, localItem];
        setItems(updated);
        saveLocalFallbackItems(updated);
      }
    } else {
      const localItem: GroupItem = {
        id: `custom-g-${Date.now()}`,
        title: newTitle.trim(),
        category: newCategory,
        picName: newPic.trim() || null,
        isCompleted: false,
        checkedBy: null,
        notes: newNotes.trim() || null,
      };
      const updated = [...items, localItem];
      setItems(updated);
      saveLocalFallbackItems(updated);
    }

    setNewTitle('');
    setNewPic('');
    setNewNotes('');
    setShowAddModal(false);
  };

  // Delete item
  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Hapus barang ini dari daftar bersama?')) return;

    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    saveLocalFallbackItems(updated);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from(TABLE_NAME).delete().eq('id', id);
      } catch (err) {
        console.warn('Failed to delete from Supabase:', err);
      }
    }
  };

  // Seed default data into Supabase or Local
  const handleSeedDefaults = async () => {
    if (!window.confirm('Muat ulang seluruh barang bawaan bersama (32 barang rekomendasi)?')) return;

    setIsSyncing(true);
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        // Delete existing and insert fresh
        await supabase.from(TABLE_NAME).delete().neq('id', '00000000-0000-0000-0000-000000000000');
        const rowsToInsert = DEFAULT_GROUP_ITEMS.map((item) => ({
          title: item.title,
          category: item.category,
          pic_name: item.picName,
          is_completed: item.isCompleted,
          checked_by: item.checkedBy,
          notes: item.notes,
        }));
        const { data, error } = await supabase.from(TABLE_NAME).insert(rowsToInsert).select();
        if (error) throw error;
        if (data) {
          fetchItems();
        }
      } catch (err) {
        console.error('Error seeding Supabase:', err);
        alert(`Gagal memasukkan data ke Supabase. Pastikan tabel ${TABLE_NAME} sudah dibuat di SQL Editor.`);
      }
    } else {
      const initial: GroupItem[] = DEFAULT_GROUP_ITEMS.map((item, idx) => ({
        id: `item-${idx + 1}`,
        ...item,
      }));
      setItems(initial);
      saveLocalFallbackItems(initial);
    }
    setIsSyncing(false);
  };

  // Filter calculations
  const completedCount = items.filter((i) => i.isCompleted).length;
  const progressPercent = items.length === 0 ? 0 : Math.round((completedCount / items.length) * 100);

  const filteredItems = items.filter((item) => {
    // Category match
    if (selectedCategory !== 'Semua' && item.category !== selectedCategory) {
      return false;
    }
    // Status match
    if (statusFilter === 'unassigned' && item.picName) return false;
    if (statusFilter === 'pending' && item.isCompleted) return false;
    if (statusFilter === 'completed' && !item.isCompleted) return false;
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchPic = item.picName?.toLowerCase().includes(q);
      const matchNotes = item.notes?.toLowerCase().includes(q);
      if (!matchTitle && !matchPic && !matchNotes) return false;
    }
    return true;
  });

  const getCategoryIcon = (cat: GroupItem['category']) => {
    switch (cat) {
      case 'BBQ & Masak':
        return <Flame className="w-3.5 h-3.5 text-rose-500" />;
      case 'Makanan & Bumbu':
        return <UtensilsCrossed className="w-3.5 h-3.5 text-amber-500" />;
      case 'Minuman & Snack':
        return <Wine className="w-3.5 h-3.5 text-purple-500" />;
      case 'Logistik Villa':
        return <Home className="w-3.5 h-3.5 text-blue-500" />;
      case 'Hiburan & Obat':
        return <Music className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Tag className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Overview & Progress Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>Barang Bawaan Bersama (Rombongan)</span>
              {isSyncing && <RefreshCw className="w-3 h-3 text-emerald-600 animate-spin" />}
            </h2>
            <p className="text-xs text-slate-500">
              {isSupabaseConnected
                ? 'Tersinkronisasi otomatis via database Supabase'
                : 'Mode offline lokal. Klik "DB Offline" di header untuk hubungkan Supabase.'}
            </p>
          </div>
          <span className="text-lg font-black text-emerald-700">{progressPercent}%</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-3">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 flex-wrap gap-2">
          <span>
            {completedCount} dari {items.length} barang siap / beres
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchItems}
              disabled={isSyncing}
              className="text-[11px] text-slate-500 hover:text-emerald-700 font-semibold flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button
              onClick={handleSeedDefaults}
              className="text-[11px] text-slate-400 hover:text-slate-700 font-medium"
            >
              Reset Data Awal
            </button>
          </div>
        </div>
      </div>

      {/* Supabase connection banner if offline */}
      {!isSupabaseConnected && (
        <div
          onClick={onOpenSupabaseModal}
          className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl flex items-center justify-between gap-3 cursor-pointer hover:border-amber-300 transition-all text-xs text-amber-900 shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-white rounded-xl shadow-sm">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-amber-950">Ingin Sinkron Antar Semua HP Rombongan?</p>
              <p className="text-[11px] text-amber-800">
                Hubungkan ke Supabase (gratis) agar checklist otomatis terupdate secara live.
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-amber-600 text-white rounded-xl font-bold text-[11px] shrink-0">
            Hubungkan DB
          </span>
        </div>
      )}

      {/* Search & Action Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari barang, PIC, atau catatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah Barang
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
        <Filter className="w-3 h-3 text-slate-400 mr-1" />
        <span>Status:</span>
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-2 py-0.5 rounded-lg ${
            statusFilter === 'all' ? 'bg-slate-200 text-slate-800' : 'hover:text-slate-800'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setStatusFilter('unassigned')}
          className={`px-2 py-0.5 rounded-lg ${
            statusFilter === 'unassigned' ? 'bg-amber-100 text-amber-800' : 'hover:text-slate-800'
          }`}
        >
          Belum Ada PIC
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-2 py-0.5 rounded-lg ${
            statusFilter === 'pending' ? 'bg-slate-200 text-slate-800' : 'hover:text-slate-800'
          }`}
        >
          Belum Siap
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          className={`px-2 py-0.5 rounded-lg ${
            statusFilter === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'hover:text-slate-800'
          }`}
        >
          Sudah Beres
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-2.5">
        {loading ? (
          <div className="bg-white rounded-2xl p-8 text-center text-xs text-slate-400 border border-slate-100">
            <RefreshCw className="w-6 h-6 mx-auto mb-2 text-emerald-500 animate-spin" />
            <span>Memuat daftar barang bersama...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-xs text-slate-400 border border-slate-100">
            <p className="font-semibold text-slate-600 text-sm">Tidak ada barang yang cocok</p>
            <p className="mt-1">Coba sesuaikan kata kunci pencarian atau kategori filter.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all bg-white ${
                item.isCompleted
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-emerald-300 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Checkbox & Details */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => handleToggleComplete(item)}
                    title={item.isCompleted ? 'Tandai belum siap' : 'Tandai sudah siap'}
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
                      item.isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : 'border-slate-300 bg-white hover:border-emerald-500'
                    }`}
                  >
                    {item.isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                        {getCategoryIcon(item.category)}
                        {item.category}
                      </span>

                      {/* PIC Badge */}
                      {item.picName ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          <UserCheck className="w-3 h-3" />
                          PIC: {item.picName}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertCircle className="w-3 h-3" />
                          Belum ada PIC
                        </span>
                      )}

                      {/* Checked By stamp */}
                      {item.isCompleted && item.checkedBy && (
                        <span className="text-[10px] text-emerald-700 font-medium">
                          ✓ Siap ({item.checkedBy})
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-xs sm:text-sm font-bold ${
                        item.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'
                      }`}
                    >
                      {item.title}
                    </p>

                    {item.notes && (
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed bg-slate-50 p-2 rounded-xl border border-slate-100">
                        💬 {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Actions (Claim & Delete) */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 shrink-0">
                  {/* Claim button */}
                  {item.picName?.toLowerCase() !== userName.toLowerCase() ? (
                    <button
                      type="button"
                      onClick={() => handleClaimPic(item)}
                      className="px-2.5 py-1 text-[11px] font-bold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg border border-slate-200 transition-all flex items-center gap-1"
                    >
                      <UserCheck className="w-3 h-3" />
                      <span className="hidden sm:inline">Saya yang bawa</span>
                      <span className="sm:hidden">Klaim</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleClaimPic(item, '')}
                      className="px-2 py-1 text-[10px] font-semibold text-slate-400 hover:text-rose-500 hover:underline"
                    >
                      Lepas PIC
                    </button>
                  )}

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1 text-slate-300 hover:text-rose-500 rounded-lg transition-colors"
                    title="Hapus barang"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" /> Tambah Barang Bersama
            </h3>

            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Barang / Kebutuhan *
                </label>
                <input
                  type="text"
                  placeholder="Misal: Gas Torch kaleng, Kipas bara arang..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  autoFocus
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as GroupItem['category'])}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                  >
                    <option value="BBQ & Masak">BBQ & Masak</option>
                    <option value="Makanan & Bumbu">Makanan & Bumbu</option>
                    <option value="Minuman & Snack">Minuman & Snack</option>
                    <option value="Logistik Villa">Logistik Villa</option>
                    <option value="Hiburan & Obat">Hiburan & Obat</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PIC (Penanggung Jawab)</label>
                  <select
                    value={newPic}
                    onChange={(e) => setNewPic(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                  >
                    <option value="">-- Belum Ditentukan --</option>
                    {userName && <option value={userName}>Saya ({userName})</option>}
                    {TRIP_MEMBERS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
                <textarea
                  placeholder="Misal: Beli di Berastagi, jangan kena babi, dsb."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md disabled:opacity-50 transition-all"
                >
                  Tambahkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
