import { GroupItem, PersonalItem } from '../types';

export const DEFAULT_PERSONAL_ITEMS: PersonalItem[] = [
  { id: 'p-1', title: 'Pakaian ganti (2 hari 1 malam + cadangan)', isCompleted: false, category: 'Pakaian' },
  { id: 'p-2', title: 'Jaket tebal / Hoodie hangat (Malam Berastagi dingin)', isCompleted: false, category: 'Pakaian' },
  { id: 'p-3', title: 'Celana panjang & Kaos kaki hangat untuk tidur', isCompleted: false, category: 'Pakaian' },
  { id: 'p-4', title: 'Sandal selop / Sandal santai untuk di dalam villa', isCompleted: false, category: 'Pakaian' },
  { id: 'p-5', title: 'Handuk mandi pribadi (Villa TIDAK sediakan handuk)', isCompleted: false, category: 'Mandi' },
  { id: 'p-6', title: 'Perlengkapan mandi (Sabun, Sampo, Sikat gigi, Odol)', isCompleted: false, category: 'Mandi' },
  { id: 'p-7', title: 'Tumbler / Botol minum sendiri (untuk isi ulang)', isCompleted: false, category: 'Perlengkapan' },
  { id: 'p-8', title: 'Charger HP & Powerbank terisi penuh', isCompleted: false, category: 'Gadget' },
  { id: 'p-9', title: 'Obat pribadi (Antimo anti mabuk jalan, Minyak angin, Maag)', isCompleted: false, category: 'Obat' },
  { id: 'p-10', title: 'Payung lipat / Jas hujan (Musim hujan di gunung)', isCompleted: false, category: 'Perlengkapan' },
  { id: 'p-11', title: 'Uang cash kecil untuk jajan & toilet umum', isCompleted: false, category: 'Keuangan' },
];

export const DEFAULT_GROUP_ITEMS: Omit<GroupItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // BBQ & Masak
  {
    title: 'Arang BBQ (Beli secukupnya untuk 1 malam)',
    category: 'BBQ & Masak',
    picName: 'Shanly',
    isCompleted: false,
    checkedBy: null,
    notes: 'Beli H-1 (Kamis/Jumat)'
  },
  {
    title: 'Gas Torch / Pemantik Api & Firestarter (Arang susah nyala tanpa ini!)',
    category: 'BBQ & Masak',
    picName: null,
    isCompleted: false,
    checkedBy: null,
    notes: 'KRUSIAL: Butuh torch kaleng / minyak tanah starter'
  },
  {
    title: 'Kuas Oles Panggangan BBQ (3 pcs)',
    category: 'BBQ & Masak',
    picName: null,
    isCompleted: false,
    checkedBy: null,
    notes: 'Untuk oles bumbu ayam, ikan, sosis, jagung'
  },
  {
    title: 'Penjepit / Capitan Panggangan (2-3 pcs)',
    category: 'BBQ & Masak',
    picName: 'Jessy',
    isCompleted: true,
    checkedBy: 'Jessy',
    notes: 'Jessy bawa 2, Shanly bawa 1 cadangan'
  },
  {
    title: 'Kipas Arang (Manual 2 pcs atau Kipas Portable)',
    category: 'BBQ & Masak',
    picName: null,
    isCompleted: false,
    checkedBy: null,
    notes: 'Untuk tiup bara arang di panggangan'
  },
  {
    title: 'Margarin Blueband (1-2 sachet)',
    category: 'BBQ & Masak',
    picName: 'Pincek',
    isCompleted: false,
    checkedBy: null,
    notes: 'Untuk oles pan grill babi, jagung, sosis'
  },
  {
    title: 'Minyak Goreng (1 botol kecil/pouch)',
    category: 'BBQ & Masak',
    picName: 'Pincek',
    isCompleted: false,
    checkedBy: null,
    notes: 'Untuk goreng kentang & sosis'
  },
  {
    title: 'Pan Khusus Grill Babi Slice',
    category: 'BBQ & Masak',
    picName: 'Shanly',
    isCompleted: false,
    checkedBy: null,
    notes: 'Pan anti-lengket terpisah dari bakaran halal'
  },
  {
    title: 'Pisau Tajam, Gunting Daging, & Talenan',
    category: 'BBQ & Masak',
    picName: null,
    isCompleted: false,
    checkedBy: null,
    notes: 'Villa seringkali pisaunya tumpul'
  },
  {
    title: 'Aluminium Foil (1 roll)',
    category: 'BBQ & Masak',
    picName: null,
    isCompleted: false,
    checkedBy: null,
    notes: 'Bakar ikan & jagung agar tidak gosong hitam'
  },

  // Makanan & Bumbu
  {
    title: 'Ayam & Ikan Segar Marinasi (Halal)',
    category: 'Makanan & Bumbu',
    picName: 'Shanly',
    isCompleted: false,
    checkedBy: null,
    notes: 'Untuk panggangan bersama (Aman untuk Citra)'
  },
  {
    title: 'Babi Slice (K-Pork)',
    category: 'Makanan & Bumbu',
    picName: 'Shanly',
    isCompleted: false,
    checkedBy: null,
    notes: 'Non-halal (Hanya untuk yang makan babi)'
  },
  {
    title: 'Sosis & Kentang Frozen (DB)',
    category: 'Makanan & Bumbu',
    picName: 'Raymond',
    isCompleted: true,
    checkedBy: 'Raymond',
    notes: 'Sudah dibeli, sekarang di freezer Raymond'
  },
  {
    title: 'Beras untuk Nasi',
    category: 'Makanan & Bumbu',
    picName: 'Pincek',
    isCompleted: true,
    checkedBy: 'Pincek',
    notes: 'Bawa dari rumah secukupnya'
  },
  {
    title: 'Sayur Selada, Tomat, & Jagung Manis',
    category: 'Makanan & Bumbu',
    picName: 'Shanly',
    isCompleted: false,
    checkedBy: null,
    notes: 'Beli Jumat pagi/sore biar tetap fresh'
  },
  {
    title: 'Gula & Garam Dapur',
    category: 'Makanan & Bumbu',
    picName: 'Usman',
    isCompleted: false,
    checkedBy: null,
    notes: 'Bawa dari rumah dibungkus plastik'
  },
  {
    title: 'Saus Sambal & Kecap Manis (DB)',
    category: 'Makanan & Bumbu',
    picName: 'Raymond',
    isCompleted: true,
    checkedBy: 'Raymond',
    notes: 'Sudah dibeli di Berastagi Supermarket'
  },
  {
    title: 'Bumbu Tambahan (Bawang putih, Merica, Boncabe Seaweed)',
    category: 'Makanan & Bumbu',
    picName: null,
    isCompleted: false,
    checkedBy: null,
    notes: 'Penyedap rasa saat grill'
  },
  {
    title: 'Porsi Makanan Khusus Halal untuk Citra',
    category: 'Makanan & Bumbu',
    picName: 'Shanly',
    isCompleted: false,
    checkedBy: null,
    notes: 'PENTING: Jangan tercampur minyak babi'
  },

  // Minuman & Snack
  {
    title: 'Aqua Botol 1.5 Liter (2 Kardus)',
    category: 'Minuman & Snack',
    picName: 'Shanly',
    isCompleted: true,
    checkedBy: 'Shanly',
    notes: 'Sudah dibeli oleh Shanly'
  },
  {
    title: 'Soju & Minuman Kaleng',
    category: 'Minuman & Snack',
    picName: 'Raymond',
    isCompleted: true,
    checkedBy: 'Raymond',
    notes: 'Disimpan di rumah Raymond'
  },
  {
    title: 'Yakult untuk Campuran Soju',
    category: 'Minuman & Snack',
    picName: 'Shanly',
    isCompleted: false,
    checkedBy: null,
    notes: 'Beli saat belanja bahan segar'
  },
  {
    title: 'Kacang Garuda Kelinci (DB)',
    category: 'Minuman & Snack',
    picName: 'Raymond',
    isCompleted: true,
    checkedBy: 'Raymond',
    notes: 'Snack santai'
  },

  // Logistik Villa
  {
    title: 'Sabun Cuci Piring Sunlight',
    category: 'Logistik Villa',
    picName: 'Pincek',
    isCompleted: true,
    checkedBy: 'Pincek',
    notes: 'Sudah disiapkan Pincek'
  },
  {
    title: 'Spons Cuci Piring Baru (2 pcs)',
    category: 'Logistik Villa',
    picName: null,
    isCompleted: false,
    checkedBy: null,
    notes: 'Villa tidak sediakan spons cuci baru'
  },
  {
    title: 'Kain Serbet / Lap Meja (2 pcs)',
    category: 'Logistik Villa',
    picName: null,
    isCompleted: false,
    checkedBy: null,
    notes: 'Untuk bersihkan meja dan tumpahan minyak'
  },
  {
    title: 'Plastik Sampah Besar / Trash Bag Hitam (5 lembar)',
    category: 'Logistik Villa',
    picName: null,
    isCompleted: false,
    checkedBy: null,
    notes: 'Untuk buang sisa arang, tulang BBQ & botol'
  },
  {
    title: 'Gelas Cup Plastik (15 pcs)',
    category: 'Logistik Villa',
    picName: 'Pincek',
    isCompleted: false,
    checkedBy: null,
    notes: 'Untuk minum rame-rame'
  },
  {
    title: 'Piring & Sendok Plastik Sekali Pakai',
    category: 'Logistik Villa',
    picName: 'Pincek',
    isCompleted: false,
    checkedBy: null,
    notes: 'Biar tidak repot cuci piring berlemak'
  },
  {
    title: 'Tusuk Lidi / Tusuk Sate',
    category: 'Logistik Villa',
    picName: 'Pincek',
    isCompleted: false,
    checkedBy: null,
    notes: 'Untuk tusuk sosis & sate'
  },
  {
    title: 'Tisu Gulung / Tisu Makan (DB)',
    category: 'Logistik Villa',
    picName: 'Raymond',
    isCompleted: true,
    checkedBy: 'Raymond',
    notes: 'Sudah dibeli saat di DB'
  },
  {
    title: 'Terminal Colokan Kabel Panjang (2 unit)',
    category: 'Logistik Villa',
    picName: null,
    isCompleted: false,
    checkedBy: null,
    notes: 'Untuk cas HP rame-rame & mic speaker'
  },

  // Hiburan & Obat
  {
    title: 'Baterai Mic Wireless (Tipe AA)',
    category: 'Hiburan & Obat',
    picName: 'Usman',
    isCompleted: false,
    checkedBy: null,
    notes: 'Usman beli di Indomaret/BM dekat kerja'
  },
  {
    title: 'Obat P3K Bersama (Tolak Angin & Panadol)',
    category: 'Hiburan & Obat',
    picName: 'Pincek & Usman',
    isCompleted: true,
    checkedBy: 'Pincek',
    notes: 'Tolak Angin (Pincek), Panadol (Usman)'
  },
  {
    title: 'Minyak Angin (Apek Iu)',
    category: 'Hiburan & Obat',
    picName: 'Shanly',
    isCompleted: false,
    checkedBy: null,
    notes: 'Untuk anti-mual & masuk angin'
  },
  {
    title: 'Set Mahjong / Kartu Remi / Uno',
    category: 'Hiburan & Obat',
    picName: 'Pincek',
    isCompleted: false,
    checkedBy: null,
    notes: 'Pincek bawa mahjong untuk main malam'
  },
  {
    title: 'Uang Cash Pelunasan Sewa Bus (Rp 1.300.000)',
    category: 'Hiburan & Obat',
    picName: 'Shanly',
    isCompleted: false,
    checkedBy: null,
    notes: 'DP 500rb sudah. Sisa 1.3jt dibayar hari H'
  },
];
