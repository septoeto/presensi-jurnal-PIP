import { ClipboardList, Loader2, Printer } from "lucide-react";

interface RekapPresensiRow {
  id: number;
  tanggal: string;
  jam: string;
  kelas: string;
  nama_siswa: string;
  instrument: string;
  guru: string;
  status: string;
  keterangan: string;
}

interface RekapPresensiProps {
  loadingRekap: boolean;
  filteredRekapList: RekapPresensiRow[];
  filterMode: "semua" | "mingguan" | "bulanan";
  setFilterMode: (mode: "semua" | "mingguan" | "bulanan") => void;
  selectedBulan: string;
  setSelectedBulan: (bulan: string) => void;
  selectedMinggu: string;
  setSelectedMinggu: (minggu: string) => void;
  selectedKelasRekap: string;
  setSelectedKelasRekap: (kelas: string) => void;
  availableKelas: string[];
  currentGuru: string | null;
  currentGuruNip: string;
}

export default function RekapPresensi({
  loadingRekap,
  filteredRekapList,
  filterMode,
  setFilterMode,
  selectedBulan,
  setSelectedBulan,
  selectedMinggu,
  setSelectedMinggu,
  selectedKelasRekap,
  setSelectedKelasRekap,
  availableKelas,
  currentGuru,
  currentGuruNip,
}: RekapPresensiProps) {
  const handlePrint = () => {
    window.print();
  };

  const summaryMap: { [key: string]: { nama: string; kelas: string; instrument: string; hadir: number; izin: number; sakit: number; alpha: number } } = {};

  filteredRekapList.forEach((row) => {
    const key = row.nama_siswa.trim().toLowerCase();
    if (!summaryMap[key]) {
      summaryMap[key] = {
        nama: row.nama_siswa,
        kelas: row.kelas || "-",
        instrument: row.instrument || "Piano",
        hadir: 0,
        izin: 0,
        sakit: 0,
        alpha: 0,
      };
    }

    const st = row.status?.toLowerCase();
    if (st === "hadir") summaryMap[key].hadir += 1;
    else if (st === "izin") summaryMap[key].izin += 1;
    else if (st === "sakit") summaryMap[key].sakit += 1;
    else if (st === "alpha") summaryMap[key].alpha += 1;
  });

  const summaryList = Object.values(summaryMap);

  return (
    <div className="space-y-6">
      {/* Tombol & Filter (Disembunyikan saat dicetak ke PDF) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <ClipboardList className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Rekap Ringkasan Presensi Siswa</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Akumulasi kehadiran siswa bimbingan Anda secara ringkas.</p>
        </div>
      
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition shadow-sm"
          >
            <Printer className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Export PDF / Cetak</span>
          </button>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Mode Filter</label>
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value as "semua" | "mingguan" | "bulanan")}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs font-semibold shadow-sm"
            >
              <option value="semua">Semua Waktu</option>
              <option value="mingguan">Pilih Minggu</option>
              <option value="bulanan">Pilih Bulan</option>
            </select>
          </div>

          {filterMode === "bulanan" && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Pilih Bulan</label>
              <input
                type="month"
                value={selectedBulan}
                onChange={(e) => setSelectedBulan(e.target.value)}
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs font-semibold shadow-sm"
              />
            </div>
          )}

          {filterMode === "mingguan" && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Pilih Minggu</label>
              <input
                type="week"
                value={selectedMinggu}
                onChange={(e) => setSelectedMinggu(e.target.value)}
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs font-semibold shadow-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Filter Kelas</label>
            <select
              value={selectedKelasRekap}
              onChange={(e) => setSelectedKelasRekap(e.target.value)}
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs font-semibold shadow-sm"
            >
              <option value="Semua">Semua Kelas</option>
              {availableKelas.map((cls, idx) => (
                <option key={idx} value={cls}>Kelas {cls}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* AREA CETAK (Kop Surat Resmi, Tabel Ringkasan, & Tanda Tangan) */}
      <div className="print:p-0 bg-transparent">
        {/* Kop Sekolah Khusus Cetak / PDF */}
        <div className="hidden print:block text-center pb-4 mb-6 border-b-2 border-slate-900 font-sans">
          <p className="text-[11px] font-bold tracking-wide uppercase text-slate-900">
            PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA
          </p>
          <p className="text-[11px] font-bold tracking-wide uppercase text-slate-900">
            DINAS PENDIDIKAN, PEMUDA, DAN OLAHRAGA
          </p>
          <p className="text-[11px] font-bold tracking-wide uppercase text-slate-900">
            BALAI PENDIDIKAN MENENGAH KAB. BANTUL
          </p>
          <h1 className="text-sm font-extrabold tracking-wider uppercase text-slate-900 mt-0.5">
            SMKN 2 KASIHAN
          </h1>
          <p className="text-[10px] text-slate-700 mt-0.5">
            Jalan PG. Madukismo Ngestiharjo Kasihan Bantul Yogyakarta Telp/Fax. 0274 374627
          </p>
          <p className="text-[10px] text-slate-700">
            Laman: www.smmyk.sch.id e-mail : sekolahmusik@gmail.com Kode Pos 55182
          </p>
        </div>

        {/* Judul Laporan saat Cetak */}
        <div className="hidden print:block mb-4 text-center">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">REKAP AKUMULASI PRESENSI PRAKTIK INSTRUMEN PIANO</h3>
          <p className="text-[11px] text-slate-600 mt-0.5">Guru Pengampu: <span className="font-bold text-slate-900">{currentGuru}</span> | Kelas: <span className="font-bold text-slate-900">{selectedKelasRekap}</span></p>
        </div>

        {loadingRekap ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3 print:hidden">
            <Loader2 className="w-7 h-7 animate-spin text-indigo-600 dark:text-indigo-400" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Memuat rekap presensi...</p>
          </div>
        ) : summaryList.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 print:border-none print:py-4">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Tidak ada data presensi pada rentang waktu/kelas ini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 print:border-none print:rounded-none shadow-sm">
            <table className="w-full text-left border-collapse text-xs print:text-[11px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 print:bg-slate-100 text-slate-600 dark:text-slate-300 print:text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 print:border-slate-200 text-center">
                  <th className="p-3.5 print:p-2 border border-slate-200 dark:border-slate-800 print:border-slate-200 w-12">No</th>
                  <th className="p-3.5 print:p-2 border border-slate-200 dark:border-slate-800 print:border-slate-200 text-left">Nama Siswa</th>
                  <th className="p-3.5 print:p-2 border border-slate-200 dark:border-slate-800 print:border-slate-200">Kelas</th>
                  <th className="p-3.5 print:p-2 border border-slate-200 dark:border-slate-800 print:border-slate-200">Instrumen</th>
                  <th className="p-3.5 print:p-2 border border-slate-200 dark:border-slate-800 print:border-slate-200 text-emerald-700 dark:text-emerald-400 print:text-emerald-700">Hadir</th>
                  <th className="p-3.5 print:p-2 border border-slate-200 dark:border-slate-800 print:border-slate-200 text-amber-700 dark:text-amber-400 print:text-amber-700">Izin</th>
                  <th className="p-3.5 print:p-2 border border-slate-200 dark:border-slate-800 print:border-slate-200 text-sky-700 dark:text-sky-400 print:text-sky-700">Sakit</th>
                  <th className="p-3.5 print:p-2 border border-slate-200 dark:border-slate-800 print:border-slate-200 text-rose-700 dark:text-rose-400 print:text-rose-700">Alpha</th>
                  <th className="p-3.5 print:p-2 border border-slate-200 dark:border-slate-800 print:border-slate-200">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 print:divide-slate-200 font-medium text-slate-700 dark:text-slate-200 print:text-slate-700 text-center">
                {summaryList.map((item, idx) => {
                  const total = item.hadir + item.izin + item.sakit + item.alpha;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 print:hover:bg-transparent transition text-slate-900 dark:text-slate-100">
                      <td className="p-3.5 print:p-2 border border-slate-200 dark:border-slate-800 print:border-slate-200 text-slate-500 dark:text-slate-400">{idx + 1}</td>
                      <td className="p-3.5 print:p-2 border border-slate-200 dark:border-slate-800 print:border-slate-200 font-bold text-slate-900 dark:text-slate-100 print:text-slate-900 text-left">{item.nama}</td>
                      <td className="p-3.5 print:p-2 border border-slate-200 dark:border-slate-800 print:border-slate-200 text-slate-600 dark:text-slate-300">Kelas {item.kelas}</td>
                      <td className="p-3.5 print:p-2 border border-slate-200 dark:border-slate-800 print:border-slate-200 text-slate-600 dark:text-slate-300">{item.instrument}</td>
                      <td className="p-3.5 print:p-2 border border-slate-200 dark:border-slate-800 print:border-slate-200 font-bold text-emerald-800 dark:text-emerald-400 print:text-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/40 print:bg-emerald-50/30">{item.hadir}</td>
                      <td className="p-3.5 print:p-2 border border-slate-200 dark:border-slate-800 print:border-slate-200 font-bold text-amber-800 dark:text-amber-400 print:text-amber-800 bg-amber-50/50 dark:bg-amber-950/40 print:bg-amber-50/30">{item.izin}</td>
                      <td className="p-3.5 print:p-2 border border-slate-200 dark:border-slate-800 print:border-slate-200 font-bold text-sky-800 dark:text-sky-400 print:text-sky-800 bg-sky-50/50 dark:bg-sky-950/40 print:bg-sky-50/30">{item.sakit}</td>
                      <td className="p-3.5 print:p-2 border border-slate-200 dark:border-slate-800 print:border-slate-200 font-bold text-rose-800 dark:text-rose-400 print:text-rose-800 bg-rose-50/50 dark:bg-rose-950/40 print:bg-rose-50/30">{item.alpha}</td>
                      <td className="p-3.5 print:p-2 border border-slate-200 dark:border-slate-800 print:border-slate-200 font-extrabold text-slate-900 dark:text-slate-100 print:text-slate-900 bg-slate-100 dark:bg-slate-800 print:bg-slate-50">{total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tanda Tangan Kepala Sekolah & Guru Pengampu */}
        <div className="hidden print:flex justify-between items-start mt-12 pt-4 px-12 text-xs font-sans page-break-inside-avoid">
          <div className="text-center">
            <p className="mb-1">Mengetahui,</p>
            <p className="mb-14">Kepala SMKN 2 Kasihan</p>
            <p className="font-bold underline">Turino, S.Pd., M.Sn.</p>
            <p className="text-[11px]">NIP. 196712232000121001</p>
          </div>
          <div className="text-center">
            <p className="mb-1">Bantul, {new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="mb-16">Guru Pengampu,</p>
            <p className="font-bold underline">{currentGuru || "___________________"}</p>
            <p className="text-[11px]">NIP. {currentGuruNip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}