import React, { useState, useEffect } from 'react';
import { PersonalItem } from '../types';
import { DEFAULT_PERSONAL_ITEMS } from '../data/defaultItems';
import { Check, Plus, Trash2, RotateCcw, CheckCircle2, Sparkles, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'trip_personal_checklist';

interface PersonalTabProps {
  userName: string;
  onUpdateProgress: (completed: number, total: number) => void;
}

export const PersonalTab: React.FC<PersonalTabProps> = ({
  userName,
  onUpdateProgress,
}) => {
  const [items, setItems] = useState<PersonalItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DEFAULT_PERSONAL_ITEMS;
  });

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Sync with local storage and update progress
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    const completedCount = items.filter((i) => i.isCompleted).length;
    onUpdateProgress(completedCount, items.length);

    // If all completed and > 0, trigger celebration confetti
    if (items.length > 0 && completedCount === items.length) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  }, [items, onUpdateProgress]);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const newItem: PersonalItem = {
      id: `custom-p-${Date.now()}`,
      title: newItemTitle.trim(),
      isCompleted: false,
      category: 'Pribadi',
    };

    setItems((prev) => [...prev, newItem]);
    setNewItemTitle('');
    setShowAddForm(false);
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const resetToDefault = () => {
    if (window.confirm('Reset daftar bawaan pribadi ke rekomendasi awal?')) {
      setItems(DEFAULT_PERSONAL_ITEMS);
    }
  };

  const completedCount = items.filter((i) => i.isCompleted).length;
  const progressPercent = items.length === 0 ? 0 : Math.round((completedCount / items.length) * 100);

  const filteredItems = items.filter((item) => {
    if (filter === 'pending') return !item.isCompleted;
    if (filter === 'completed') return item.isCompleted;
    return true;
  });

  return (
    <div className="space-y-4 pb-12">
      {/* Overview & Progress Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <span>Tas Bawaan {userName ? userName : 'Pribadi'}</span>
              {progressPercent === 100 && (
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-bounce">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> Siap Berangkat!
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500">
              Tersimpan aman di browser HP kamu (tidak hilang saat reload).
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

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            {completedCount} dari {items.length} barang sudah masuk tas
          </span>
          <button
            onClick={resetToDefault}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 font-medium"
          >
            <RotateCcw className="w-3 h-3" /> Reset ke Rekomendasi
          </button>
        </div>
      </div>

      {/* Warning Notice about Villa Alam Indah */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900 text-xs">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Pengingat Penting Villa:</span>
          <p className="mt-0.5 text-amber-800 leading-relaxed">
            Villa Alam Indah <strong>TIDAK menyediakan handuk, sabun, dan odol</strong>. Pastikan sudah memasukkan handuk mandi dan perlengkapan mandi pribadi ke dalam tas.
          </p>
        </div>
      </div>

      {/* Filter and Add Button */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({items.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'pending'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Belum ({items.length - completedCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'completed'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sudah ({completedCount})
          </button>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Tambah Barang
        </button>
      </div>

      {/* Add New Item Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddItem}
          className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-sm flex gap-2 animate-fade-in"
        >
          <input
            type="text"
            placeholder="Contoh: Kacamata hitam, snack tambahan..."
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            autoFocus
            className="flex-1 px-3 py-2 text-base sm:text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shrink-0"
          >
            Simpan
          </button>
        </form>
      )}

      {/* Item List */}
      <div className="space-y-2">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 text-slate-400 text-xs">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-400 opacity-80" />
            <p className="font-medium text-slate-600">Tidak ada barang di kategori ini</p>
            <p className="text-[11px] mt-0.5">Semua barang yang dipilih sudah sesuai filter.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer select-none ${
                item.isCompleted
                  ? 'bg-emerald-50/40 border-emerald-200 text-slate-400'
                  : 'bg-white border-slate-200/80 hover:border-emerald-300 text-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  aria-label="Toggle complete"
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all shrink-0 ${
                    item.isCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                      : 'border-slate-300 bg-white hover:border-emerald-500'
                  }`}
                >
                  {item.isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                </button>
                <div className="min-w-0">
                  <p
                    className={`text-xs sm:text-sm font-semibold truncate ${
                      item.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {item.title}
                  </p>
                  {item.category && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem(item.id);
                }}
                className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                title="Hapus barang"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
