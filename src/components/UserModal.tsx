import React, { useState } from 'react';
import { TRIP_MEMBERS, TripMember } from '../types';
import { User, Check, X, Sparkles } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSaveName: (name: string) => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  currentName,
  onSaveName,
}) => {
  const [selectedName, setSelectedName] = useState(currentName || '');
  const [customName, setCustomName] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (name: string) => {
    setSelectedName(name);
    setIsCustomMode(false);
  };

  const handleSave = () => {
    const finalName = isCustomMode ? customName.trim() : selectedName.trim();
    if (!finalName) return;
    onSaveName(finalName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-100 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-emerald-800">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Siapa Nama Kamu?</h2>
              <p className="text-xs text-slate-500">
                Nama ini tersimpan di HP kamu untuk menandai checklist bersama
              </p>
            </div>
          </div>
          {currentName && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Member selector */}
        <div className="py-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
            Pilih Anggota Rombongan (10 Orang):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TRIP_MEMBERS.map((member) => {
              const isSelected = !isCustomMode && selectedName.toLowerCase() === member.toLowerCase();
              return (
                <button
                  key={member}
                  type="button"
                  onClick={() => handleSelect(member)}
                  className={`py-2 px-3 rounded-xl text-sm font-semibold flex items-center justify-between border transition-all text-left ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span className="truncate">{member}</span>
                  {isSelected && <Check className="w-4 h-4 ml-1 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Or custom name input */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-600">
                Nama kamu tidak ada di atas?
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsCustomMode(!isCustomMode);
                  if (!isCustomMode) setSelectedName('');
                }}
                className="text-xs text-emerald-600 font-semibold hover:underline"
              >
                {isCustomMode ? 'Pilih dari daftar' : '+ Ketik nama sendiri'}
              </button>
            </div>

            {isCustomMode && (
              <input
                type="text"
                placeholder="Masukkan nama panggilanmu..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                autoFocus
                className="w-full px-3 py-2 rounded-xl border border-emerald-400 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-emerald-50/30"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          {currentName && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Batal
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isCustomMode ? !customName.trim() : !selectedName}
            className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl shadow-md disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Simpan & Mulai
          </button>
        </div>
      </div>
    </div>
  );
};
