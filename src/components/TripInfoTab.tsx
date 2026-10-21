import React from 'react';
import {
  MapPin,
  Clock,
  Car,
  AlertTriangle,
  Wallet,
  Calendar,
  Utensils,
  Music,
  CheckCircle,
} from 'lucide-react';

export const TripInfoTab: React.FC = () => {
  return (
    <div className="space-y-4 pb-16 text-xs text-slate-700">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-2xl p-4 shadow-md">
        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1">
          Rangkuman Perjalanan
        </span>
        <h2 className="text-base font-extrabold text-white">
          Berastagi Weekend Trip (Jay's Farewell)
        </h2>
        <p className="text-emerald-100 text-xs mt-1">
          24 – 25 Oktober 2026 • 2 Hari 1 Malam • 10 Orang
        </p>
      </div>

      {/* Critical Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Halal Alert */}
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
          <div className="flex items-center gap-2 text-amber-900 font-bold mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Catatan Menu Halal (Citra)</span>
          </div>
          <p className="text-amber-800 leading-relaxed">
            Citra tidak makan babi. Pastikan pan panggangan babi slice dipisah dan ayam/ikan/sosis untuk Citra tidak terkena lemak babi. Saat rombongan makan siang di Bagor Kabanjahe (Day 2), siapkan makanan halal terlebih dahulu untuk Citra.
          </p>
        </div>

        {/* Villa Rules Alert */}
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl">
          <div className="flex items-center gap-2 text-blue-900 font-bold mb-1">
            <Music className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Aturan Karaoke & Villa</span>
          </div>
          <p className="text-blue-800 leading-relaxed">
            Batas maksimal karaoke villa adalah <strong>jam 23.00 WIB</strong>. Villa <strong>TIDAK menyediakan handuk dan sabun mandi</strong>, harap masing-masing bawa sendiri dari rumah.
          </p>
        </div>
      </div>

      {/* Logistics & Cost Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Villa */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Villa Alam Indah</span>
          </div>
          <div className="space-y-1 text-slate-600">
            <p>• <strong>Biaya:</strong> Rp 1.000.000 (Lunas dibayar Shanly)</p>
            <p>• <strong>Check-in:</strong> Sabtu, 14.00 WIB</p>
            <p>• <strong>Check-out:</strong> Minggu, 12.00 WIB</p>
            <p>• <strong>Fasilitas:</strong> 3-4 KT, 2 KM (Water heater), TV, Kulkas, Dispenser, Alat panggangan</p>
          </div>
        </div>

        {/* Transport */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <Car className="w-4 h-4 text-emerald-600" />
            <span>Sewa Bus (12-15 Kursi)</span>
          </div>
          <div className="space-y-1 text-slate-600">
            <p>• <strong>Total Biaya:</strong> Rp 1.800.000</p>
            <p>• <strong>DP:</strong> Rp 500.000 (Dibayar Shanly)</p>
            <p>• <strong>Sisa Hari H:</strong> Rp 1.300.000 (Cash)</p>
            <p>• <strong>Supir:</strong> Disediakan penyewa bus</p>
          </div>
        </div>

        {/* Keberangkatan */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Jadwal Penjemputan</span>
          </div>
          <div className="space-y-1 text-slate-600">
            <p>• <strong>06.00 WIB:</strong> Titipapan</p>
            <p>• <strong>07.00 WIB:</strong> Medan</p>
            <p>• <strong>Rute:</strong> Shanly → Pincek → Ahong → Jessy → Citra → Raymond</p>
          </div>
        </div>
      </div>

      {/* Itinerary Timeline */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          Rencana Jadwal Aktivitas (Itinerary)
        </h3>

        <div className="space-y-4 border-l-2 border-emerald-500/30 pl-4 ml-2">
          {/* Day 1 */}
          <div>
            <span className="font-bold text-emerald-800 text-xs">SABTU, 24 OKTOBER 2026 (HARI 1)</span>
            <ul className="mt-1 space-y-1 text-slate-600 list-disc list-inside">
              <li>06.00 / 07.00 WIB: Penjemputan rombongan & otw menuju Berastagi via Sibolangit.</li>
              <li>Pagi: Singgah di Penatapan / diskusi opsi ATV Sibolangit.</li>
              <li>14.00 WIB: Check-in Villa Alam Indah Berastagi & bongkar muatan.</li>
              <li>Sore: Santai di kafe seputaran Berastagi (Kalang Ulu / Sarune / lainnya).</li>
              <li>19.00 - 23.00 WIB: BBQ Night (Ayam, Ikan, Babi slice, Sosis, Jagung) & Karaoke di Villa.</li>
              <li>23.00 WIB: Deep talk, games santai / Mahjong (karaoke off sesuai aturan komplek).</li>
            </ul>
          </div>

          {/* Day 2 */}
          <div>
            <span className="font-bold text-emerald-800 text-xs">MINGGU, 25 OKTOBER 2026 (HARI 2)</span>
            <ul className="mt-1 space-y-1 text-slate-600 list-disc list-inside">
              <li>Pagi: Belanja buah segar & sayur di Pasar Tradisional Berastagi.</li>
              <li>11.30 WIB: Beres-beres & Check-out dari villa.</li>
              <li>Siang: Makan siang Bagor (Babi Goreng) Kabanjahe / menu halal untuk Citra.</li>
              <li>Sore: Harvest Moon / The Hill / Ingot.</li>
              <li>19.00 WIB: Perjalanan kembali pulang menuju Medan.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact & Participants */}
      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">10 Anggota Rombongan:</p>
        <p className="mt-1">
          Sam • Shanly • Raymond • Pincek • Jay • Usman • Justin • Angela • Jessy • Citra
        </p>
      </div>
    </div>
  );
};
