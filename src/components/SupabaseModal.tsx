import React, { useState } from 'react';
import { Database, Copy, Check, X, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  SUPABASE_SQL_SCHEMA,
} from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCredentialsUpdated: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onCredentialsUpdated,
}) => {
  const currentCreds = getSupabaseCredentials();
  const [url, setUrl] = useState(currentCreds.url);
  const [anonKey, setAnonKey] = useState(currentCreds.anonKey);
  const [copied, setCopied] = useState(false);
  const [showSql, setShowSql] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = () => {
    if (url.trim() && anonKey.trim()) {
      saveSupabaseCredentials(url.trim(), anonKey.trim());
    } else {
      clearSupabaseCredentials();
    }
    onCredentialsUpdated();
    onClose();
  };

  const handleClear = () => {
    clearSupabaseCredentials();
    setUrl('');
    setAnonKey('');
    onCredentialsUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-emerald-800">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Koneksi Supabase Database</h2>
              <p className="text-xs text-slate-500">
                Sinkronisasi checklist bersama secara real-time antar HP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-xs">
          {/* Explanation Alert */}
          <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl flex items-start gap-2.5 text-emerald-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-950">Cara Menghubungkan Supabase:</p>
              <ol className="list-decimal list-inside space-y-1 mt-1 text-slate-600">
                <li>Buka proyek di <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-2.5 h-2.5" /></a></li>
                <li>Salin script SQL di bawah ke menu <strong>SQL Editor</strong> & jalankan (Run).</li>
                <li>Salin <strong>Project URL</strong> & <strong>anon public key</strong> dari menu Project Settings &gt; API.</li>
              </ol>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Supabase Anon Public API Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* SQL Snippet Collapsible */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                📜 SQL Schema Tabel (trip_group_items)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-sm transition-all"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Tersalin!' : 'Salin SQL'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSql(!showSql)}
                  className="text-emerald-700 font-semibold hover:underline text-[11px]"
                >
                  {showSql ? 'Tutup' : 'Lihat'}
                </button>
              </div>
            </div>

            {showSql && (
              <pre className="p-3 bg-slate-900 text-slate-100 text-[11px] font-mono overflow-x-auto max-h-48 leading-relaxed">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            )}
          </div>

          {/* Offline notice */}
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Jika dikosongkan, aplikasi otomatis menggunakan penyimpanan lokal (offline mode) di browser ini.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold hover:underline"
          >
            Hapus Konfigurasi
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl shadow-md transition-all"
            >
              Simpan & Hubungkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
