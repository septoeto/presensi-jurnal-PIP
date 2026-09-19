import { useState, useEffect } from "react";
import { BookOpen, Loader2, Printer } from "lucide-react";
import { supabase } from "../lib/supabase";

interface Siswa {
  nama_siswa: string;
  kelas: string;
  guru: string;
  instrument: string;
}

interface JurnalRow {
  id: number;
  tanggal: string;
  kelas: string;
  nama_siswa: string;
  instrument: string;
  guru: string;
  tangganada?: string;
  tangganada_status?: string;
  etude_teknik?: string;
  etude_teknik_no?: string;
  etude_teknik_status?: string;
  etude_melodi?: string;
  etude_melodi_no?: string;
  etude_melodi_status?: string;
  polifonik?: string;
  polifonik_no?: string;
  polifonik_status?: string;
  sonata?: string;
  sonata_komponis?: string;
  sonata_mov?: string;
  sonata_status?: string;
  pieces_judul?: string;
  pieces_komponis?: string;
  pieces_status?: string;
}

interface RekapJurnalProps {
  currentGuru: string | null;
  currentGuruNip: string;
  siswaList: Siswa[];
  availableKelas: string[];
}

export default function RekapJurnal({
  currentGuru,
  currentGuruNip,
  siswaList,
  availableKelas,
}: RekapJurnalProps) {
  const [jurnalList, setJurnalList] = useState<JurnalRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter State
  const [filterMode, setFilterMode] = useState<"semua" | "mingguan" | "bulanan">("semua");
  const [selectedBulan, setSelectedBulan] = useState(new Date().toISOString().slice(0, 7));
  const [selectedMinggu, setSelectedMinggu] = useState(() => {
    const now = new Date();
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  });
  const [selectedKelas, setSelectedKelas] = useState("Semua");
  const [selectedNamaSiswa, setSelectedNamaSiswa] = useState("Semua");

  const fetchRekapJurnal = async () => {
    if (!currentGuru) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("jurnal")
        .select("*")
        .ilike("guru", currentGuru)
        .order("tanggal", { ascending: false });

      if (error) throw error;
      setJurnalList(data || []);
    } catch (err) {
      console.error("Gagal memuat rekap jurnal:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRekapJurnal();
  }, [currentGuru]);

  // Filter daftar siswa sesuai dengan kelas yang dipilih
  const filteredSiswaForDropdown = siswaList.filter((s) => {
    const matchGuru = s.guru?.trim().toLowerCase() === currentGuru?.trim().toLowerCase();
    if (!matchGuru) return false;
    if (selectedKelas === "Semua") return true;
    return s.kelas?.trim() === selectedKelas;
  });

  // Reset pilihan nama siswa ke "Semua" jika kelas diubah
  useEffect(() => {
    setSelectedNamaSiswa("Semua");
  }, [selectedKelas]);

  const getWeekNumber = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  };

  // Filter data jurnal berdasarkan Mode Waktu, Kelas, dan Nama Siswa
  const filteredJurnalList = jurnalList.filter((item) => {
    const matchKelas = selectedKelas === "Semua" || item.kelas?.trim() === selectedKelas;
    if (!matchKelas) return false;

    const matchNama = selectedNamaSiswa === "Semua" || item.nama_siswa?.trim().toLowerCase() === selectedNamaSiswa.trim().toLowerCase();
    if (!matchNama) return false;

    if (filterMode === "bulanan") {
      return item.tanggal && item.tanggal.startsWith(selectedBulan);
    } else if (filterMode === "mingguan") {
      const itemWeek = getWeekNumber(item.tanggal);
      return itemWeek === selectedMinggu;
    }
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Tombol & Filter (Disembunyikan saat dicetak) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 print:hidden">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 flex items-center space-x-2.5">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Rekap Jurnal Mengajar Siswa</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Daftar perkembangan materi dan repertoire bimbingan praktik.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition shadow-2xs"
          >
            <Printer className="w-4 h-4 text-indigo-600" />
            <span>Export PDF / Cetak</span>
          </button>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Mode Filter</label>
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value as "semua" | "mingguan" | "bulanan")}
              className="rounded-xl border border-slate-300 bg-white text-slate-900 px-3 py-2 text-xs font-semibold shadow-2xs"
            >
              <option value="semua">Semua Waktu</option>
              <option value="mingguan">Pilih Minggu</option>
              <option value="bulanan">Pilih Bulan</option>
            </select>
          </div>

          {filterMode === "bulanan" && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Pilih Bulan</label>
              <input
                type="month"
                value={selectedBulan}
                onChange={(e) => setSelectedBulan(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white text-slate-900 px-3 py-2 text-xs font-semibold shadow-2xs"
              />
            </div>
          )}

          {filterMode === "mingguan" && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Pilih Minggu</label>
              <input
                type="week"
                value={selectedMinggu}
                onChange={(e) => setSelectedMinggu(e.target.value)}
                className="rounded-xl border border-slate-300 bg-white text-slate-900 px-3 py-2 text-xs font-semibold shadow-2xs"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Filter Kelas</label>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white text-slate-900 px-3 py-2 text-xs font-semibold shadow-2xs"
            >
              <option value="Semua">Semua Kelas</option>
              {availableKelas.map((cls, idx) => (
                <option key={idx} value={cls}>Kelas {cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Filter Nama Siswa</label>
            <select
              value={selectedNamaSiswa}
              onChange={(e) => setSelectedNamaSiswa(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white text-slate-900 px-3 py-2 text-xs font-semibold shadow-2xs"
            >
              <option value="Semua">Semua Siswa</option>
              {filteredSiswaForDropdown.map((s, idx) => (
                <option key={idx} value={s.nama_siswa}>{s.nama_siswa}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* AREA CETAK PDF (Ringkas & Efisien) */}
      <div className="print:p-0 bg-transparent">
        {/* Kop Surat Resmi */}
        <div className="hidden print:block text-center pb-3 mb-4 border-b-2 border-slate-900 font-sans">
          <p className="text-[10px] font-bold tracking-wide uppercase text-slate-900">PEMERINTAH DAERAH DAERAH ISTIMEWA YOGYAKARTA</p>
          <p className="text-[10px] font-bold tracking-wide uppercase text-slate-900">DINAS PENDIDIKAN, PEMUDA, DAN OLAHRAGA</p>
          <p className="text-[10px] font-bold tracking-wide uppercase text-slate-900">BALAI PENDIDIKAN MENENGAH KAB. BANTUL</p>
          <h1 className="text-xs font-extrabold tracking-wider uppercase text-slate-900 mt-0.5">SMKN 2 KASIHAN</h1>
          <p className="text-[9px] text-slate-700">Jalan PG. Madukismo Ngestiharjo Kasihan Bantul Yogyakarta Telp. 0274 374627</p>
        </div>

        <div className="hidden print:block mb-3 text-center">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">REKAP JURNAL MENGAJAR PRAKTIK PIANO</h3>
          <p className="text-[10px] text-slate-600">Guru Pengampu: <span className="font-bold text-slate-900">{currentGuru}</span> | Kelas: <span className="font-bold text-slate-900">{selectedKelas}</span> | Siswa: <span className="font-bold text-slate-900">{selectedNamaSiswa}</span></p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3 print:hidden">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            <p className="text-xs text-slate-500 font-medium">Memuat rekap jurnal...</p>
          </div>
        ) : filteredJurnalList.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 print:border-none print:py-4">
            <p className="text-xs font-semibold text-slate-500">Tidak ada data jurnal mengajar pada filter ini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 print:border-none print:rounded-none shadow-2xs">
            <table className="w-full text-left border-collapse text-xs print:text-[10px]">
              <thead>
                <tr className="bg-slate-50 print:bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200 text-center">
                  <th className="p-2.5 border border-slate-200 w-10">No</th>
                  <th className="p-2.5 border border-slate-200 w-24">Tanggal</th>
                  <th className="p-2.5 border border-slate-200 text-left">Nama Siswa / Kelas</th>
                  <th className="p-2.5 border border-slate-200 text-left">Tangganada & Etude Teknik</th>
                  <th className="p-2.5 border border-slate-200 text-left">Polifonik & Sonata</th>
                  <th className="p-2.5 border border-slate-200 text-left">Repertoire / Pieces</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 print:divide-slate-200 font-medium text-slate-700">
                {filteredJurnalList.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 print:hover:bg-transparent transition align-top">
                    <td className="p-2.5 border border-slate-200 text-center text-slate-500">{idx + 1}</td>
                    <td className="p-2.5 border border-slate-200 text-center font-semibold text-slate-900">{item.tanggal}</td>
                    <td className="p-2.5 border border-slate-200">
                      <p className="font-bold text-slate-900">{item.nama_siswa}</p>
                      <p className="text-[10px] text-slate-500">Kelas {item.kelas} • {item.instrument}</p>
                    </td>
                    <td className="p-2.5 border border-slate-200 space-y-0.5">
                      {item.tangganada && <p><span className="font-semibold text-slate-900">Skala:</span> {item.tangganada} ({item.tangganada_status || "-"})</p>}
                      {item.etude_teknik && <p><span className="font-semibold text-slate-900">Teknik:</span> {item.etude_teknik} No.{item.etude_teknik_no} ({item.etude_teknik_status || "-"})</p>}
                      {!item.tangganada && !item.etude_teknik && <span className="text-slate-400 italic">-</span>}
                    </td>
                    <td className="p-2.5 border border-slate-200 space-y-0.5">
                      {item.polifonik && <p><span className="font-semibold text-slate-900">Polifonik:</span> {item.polifonik} {item.polifonik_no} ({item.polifonik_status || "-"})</p>}
                      {item.sonata && <p><span className="font-semibold text-slate-900">Sonata:</span> {item.sonata} - {item.sonata_komponis} ({item.sonata_status || "-"})</p>}
                      {!item.polifonik && !item.sonata && <span className="text-slate-400 italic">-</span>}
                    </td>
                    <td className="p-2.5 border border-slate-200">
                      {item.pieces_judul ? (
                        <p><span className="font-semibold text-slate-900">{item.pieces_judul}</span> ({item.pieces_komponis}) - <span className="text-slate-600">{item.pieces_status || "-"}</span></p>
                      ) : (
                        <span className="text-slate-400 italic">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tanda Tangan Ringkas */}
        <div className="hidden print:flex justify-between items-start mt-8 pt-2 px-8 text-[10px] font-sans page-break-inside-avoid">
          <div className="text-center">
            <p className="mb-1">Mengetahui,</p>
            <p className="mb-10">Kepala SMKN 2 Kasihan</p>
            <p className="font-bold underline">Turino, S.Pd., M.Sn.</p>
            <p className="text-[9px]">NIP. 196712232000121001</p>
          </div>
          <div className="text-center">
            <p className="mb-1">Bantul, {new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="mb-12">Guru Pengampu,</p>
            <p className="font-bold underline">{currentGuru || "___________________"}</p>
            <p className="text-[9px]">NIP. {currentGuruNip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}