import React from 'react';
import { Mountain, User, Database, Sparkles, MapPin, Calendar } from 'lucide-react';

interface HeaderProps {
  userName: string;
  onOpenUserModal: () => void;
  onOpenSupabaseModal: () => void;
  isSupabaseConnected: boolean;
  activeTab: 'personal' | 'group' | 'info';
  setActiveTab: (tab: 'personal' | 'group' | 'info') => void;
  personalProgress: { completed: number; total: number };
  groupProgress: { completed: number; total: number };
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  onOpenUserModal,
  onOpenSupabaseModal,
  isSupabaseConnected,
  activeTab,
  setActiveTab,
  personalProgress,
  groupProgress,
}) => {
  return (
    <header className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white shadow-lg sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-3">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-xl shadow-inner">
              🏔️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-white leading-tight">
                  Berastagi Trip
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Jay's Farewell
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-300" /> Villa Alam Indah
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-300" /> 24-25 Okt 2026
                </span>
              </p>
            </div>
          </div>

          {/* Action buttons on header */}
          <div className="flex items-center gap-2">
            {/* Supabase status indicator */}
            <button
              onClick={onOpenSupabaseModal}
              title={isSupabaseConnected ? 'Supabase Terhubung' : 'Hubungkan Supabase'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isSupabaseConnected
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 hover:bg-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-200 border border-amber-400/40 hover:bg-amber-500/30'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isSupabaseConnected ? 'DB Online' : 'DB Offline'}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
            </button>

            {/* Current user badge */}
            <button
              onClick={onOpenUserModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/15 hover:bg-white/25 border border-white/20 transition-all text-white backdrop-blur-sm"
            >
              <User className="w-3.5 h-3.5 text-emerald-300" />
              <span className="max-w-[90px] truncate">
                {userName ? userName : 'Pilih Nama'}
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-black/20 p-1 rounded-xl backdrop-blur-sm border border-white/10 text-xs font-medium">
          <button
            onClick={() => setActiveTab('personal')}
            className={`py-2 px-2 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
              activeTab === 'personal'
                ? 'bg-white text-emerald-950 font-bold shadow-md'
                : 'text-emerald-100/90 hover:bg-white/10'
            }`}
          >
            <span>🎒 Bawaan Pribadi</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                activeTab === 'personal'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-white/20 text-emerald-100'
              }`}
            >
              {personalProgress.completed}/{personalProgress.total}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('group')}
            className={`py-2 px-2 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
              activeTab === 'group'
                ? 'bg-white text-emerald-950 font-bold shadow-md'
                : 'text-emerald-100/90 hover:bg-white/10'
            }`}
          >
            <span>🤝 Bawaan Bersama</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                activeTab === 'group'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-white/20 text-emerald-100'
              }`}
            >
              {groupProgress.completed}/{groupProgress.total}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
              activeTab === 'info'
                ? 'bg-white text-emerald-950 font-bold shadow-md'
                : 'text-emerald-100/90 hover:bg-white/10'
            }`}
          >
            <span>ℹ️ Rencana & Info</span>
          </button>
        </div>
      </div>
    </header>
  );
};
