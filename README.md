# 🏔️ Berastagi Trip Checklist (Web App)

Aplikasi checklist sederhana & responsif untuk perjalanan liburan **Berastagi (24–25 Okt 2026)**.

---

## ✨ Fitur Utama

1. **🎒 Checklist Pribadi (Tersimpan di Local Storage)**:
   - Setiap peserta menandai tas bawaan pribadinya sendiri di HP masing-masing.
   - Dilengkapi rekomendasi barang bawaan (jaket tebal, obat pribadi, handuk mandi yang tidak ada di villa, powerbank, tumbler, dsb).
   - Indikator progres & perayaan konfeti saat semua barang sudah siap.
   - Bisa menambah atau menghapus barang pribadi kustom.

2. **🤝 Checklist Bersama (Tersinkronisasi Realtime via Supabase)**:
   - **Input Nama Sekali**: Saat pertama kali membuka atau mencentang, pengguna memilih/memasukkan namanya (misal: *Sam*, *Shanly*, *Pincek*, *Raymond*, dll). Nama ini tersimpan otomatis di `localStorage`.
   - **Pencatatan Otomatis**: Setiap barang yang dicentang akan otomatis mencatat siapa yang menyelesaikan (*checked by*) dan waktu penyelesaian.
   - **Klaim PIC ("Saya yang bawa ini")**: Tombol cepat 1-klik untuk mengambil tanggung jawab barang.
   - **Kategori Terorganisir**: BBQ & Masak, Makanan & Bumbu, Minuman & Snack, Logistik Villa, Hiburan & Obat.
   - **Mode Offline Graceful Fallback**: Jika Supabase belum dikonfigurasi, aplikasi tetap berjalan 100% menggunakan penyimpanan lokal.

3. **ℹ️ Tab Rencana & Info Trip**:
   - Info lengkap villa, jadwal penjemputan (06.00 Titipapan / 07.00 Medan), pengingat menu non-babi Citra, dan timeline kegiatan.

---

## 🚀 Cara Menjalankan

Aplikasi saat ini sudah berjalan di:
- **Local:** `http://localhost:5173/`
- **Network (Buka dari HP di Wi-Fi yang sama):** `http://192.168.215.144:5173/`

Jika ingin menjalankan ulang di terminal:
```bash
cd /Users/sam/berastagi-checklist
bun run dev -- --host
```

---

## 🗄️ Menghubungkan Supabase Database

1. Buka dashboard [Supabase](https://supabase.com/dashboard) dan buat proyek baru.
2. Buka menu **SQL Editor**, lalu jalankan query dari file [`supabase_schema.sql`](file:///Users/sam/berastagi-checklist/supabase_schema.sql).
3. Buka web app, klik tombol **"DB Offline"** di pojok kanan atas, lalu masukkan:
   - **Supabase Project URL**
   - **Supabase Anon Public Key**
4. Klik **"Simpan & Hubungkan"**. Semua checklist bersama akan tersinkronisasi langsung antar semua perangkat!
