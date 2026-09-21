import { BookOpen, Send, Loader2 } from "lucide-react";

interface Siswa {
  nama_siswa: string;
  kelas: string;
  guru: string;
  instrument: string;
}

interface Suggestion {
  etude_teknik_judul?: string;
  etude_melodi_judul?: string;
  polifonik_judul?: string;
  sonatina_sonata_judul?: string;
}

interface FormJurnalProps {
  tanggal: string;
  setTanggal: (val: string) => void;
  availableKelas: string[];
  selectedKelasJurnal: string;
  setSelectedKelasJurnal: (val: string) => void;
  filteredSiswaByKelasJurnal: Siswa[];
  selectedSiswaJurnal: Siswa | null;
  setSelectedSiswaJurnal: (siswa: Siswa | null) => void;
  suggestionList: Suggestion[];
  tangganada: string;
  setTangganada: (val: string) => void;
  tangganadaStatus: string;
  setTangganadaStatus: (val: string) => void;
  etudeTeknik: string;
  setEtudeTeknik: (val: string) => void;
  etudeTeknikNo: string;
  setEtudeTeknikNo: (val: string) => void;
  etudeTeknikStatus: string;
  setEtudeTeknikStatus: (val: string) => void;
  etudeMelodi: string;
  setEtudeMelodi: (val: string) => void;
  etudeMelodiNo: string;
  setEtudeMelodiNo: (val: string) => void;
  etudeMelodiStatus: string;
  setEtudeMelodiStatus: (val: string) => void;
  polifonik: string;
  setPolifonik: (val: string) => void;
  polifonikNo: string;
  setPolifonikNo: (val: string) => void;
  polifonikStatus: string;
  setPolifonikStatus: (val: string) => void;
  sonata: string;
  setSonata: (val: string) => void;
  sonataStatus: string;
  setSonataStatus: (val: string) => void;
  piecesJudul: string;
  setPiecesJudul: (val: string) => void;
  piecesStatus: string;
  setPiecesStatus: (val: string) => void;
  submitting: boolean;
  handleSubmitJurnal: (e: React.FormEvent) => void;
}

export default function FormJurnal({
  tanggal,
  setTanggal,
  availableKelas,
  selectedKelasJurnal,
  setSelectedKelasJurnal,
  filteredSiswaByKelasJurnal,
  selectedSiswaJurnal,
  setSelectedSiswaJurnal,
  suggestionList,
  tangganada,
  setTangganada,
  tangganadaStatus,
  setTangganadaStatus,
  etudeTeknik,
  setEtudeTeknik,
  etudeTeknikNo,
  setEtudeTeknikNo,
  etudeTeknikStatus,
  setEtudeTeknikStatus,
  etudeMelodi,
  setEtudeMelodi,
  etudeMelodiNo,
  setEtudeMelodiNo,
  etudeMelodiStatus,
  setEtudeMelodiStatus,
  polifonik,
  setPolifonik,
  polifonikNo,
  setPolifonikNo,
  polifonikStatus,
  setPolifonikStatus,
  sonata,
  setSonata,
  sonataStatus,
  setSonataStatus,
  piecesJudul,
  setPiecesJudul,
  piecesStatus,
  setPiecesStatus,
  submitting,
  handleSubmitJurnal,
}: FormJurnalProps) {
  return (
    <form onSubmit={handleSubmitJurnal} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 flex items-center space-x-2.5">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Jurnal Materi & Repertoire Per Siswa</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Catat perkembangan materi praktik piano secara spesifik per siswa.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">Tanggal</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 text-slate-900 px-3 py-2 text-xs font-medium shadow-2xs outline-none transition"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Pilih Kelas</label>
          <select
            value={selectedKelasJurnal}
            onChange={(e) => setSelectedKelasJurnal(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 text-slate-900 px-3.5 py-2.5 text-xs font-semibold shadow-2xs outline-none transition"
          >
            {availableKelas.length === 0 ? (
              <option value="">Tidak ada kelas</option>
            ) : (
              availableKelas.map((cls, idx) => (
                <option key={idx} value={cls}>Kelas {cls}</option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Pilih Siswa</label>
          <select
            value={selectedSiswaJurnal?.nama_siswa || ""}
            onChange={(e) => {
              const found = filteredSiswaByKelasJurnal.find((s) => s.nama_siswa === e.target.value);
              if (found) setSelectedSiswaJurnal(found);
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 text-slate-900 px-3.5 py-2.5 text-xs font-semibold shadow-2xs outline-none transition"
          >
            {filteredSiswaByKelasJurnal.length === 0 ? (
              <option value="">Tidak ada siswa</option>
            ) : (
              filteredSiswaByKelasJurnal.map((s, idx) => (
                <option key={idx} value={s.nama_siswa}>{s.nama_siswa}</option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Instrumen</label>
          <div className="px-3.5 py-2.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-900 border border-slate-200 flex items-center">
            {selectedSiswaJurnal?.instrument || "Piano"}
          </div>
        </div>
      </div>

      {/* Bagian Input Sub-Materi */}
      <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">1. Tangga Nada (Scale / Arpeggio)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={tangganada}
            onChange={(e) => setTangganada(e.target.value)}
            placeholder="C Major / A minor 2 oktaf"
            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 px-3.5 py-2.5 text-xs font-medium placeholder:text-slate-500 shadow-2xs outline-none transition"
          />
          <input
            type="text"
            value={tangganadaStatus}
            onChange={(e) => setTangganadaStatus(e.target.value)}
            placeholder="Status (Contoh: Belum / Lancar)"
            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 px-3.5 py-2.5 text-xs font-medium placeholder:text-slate-500 shadow-2xs outline-none transition"
          />
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">2. Etude Teknik</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            list="listEtudeTeknik"
            value={etudeTeknik}
            onChange={(e) => setEtudeTeknik(e.target.value)}
            placeholder="Buku teknik (Cth: Czerny Op. 599)"
            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 px-3.5 py-2.5 text-xs font-medium placeholder:text-slate-500 shadow-2xs outline-none transition"
          />
          <input
            type="text"
            value={etudeTeknikNo}
            onChange={(e) => setEtudeTeknikNo(e.target.value)}
            placeholder="No. Etude"
            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 px-3.5 py-2.5 text-xs font-medium placeholder:text-slate-500 shadow-2xs outline-none transition"
          />
          <input
            type="text"
            value={etudeTeknikStatus}
            onChange={(e) => setEtudeTeknikStatus(e.target.value)}
            placeholder="Status"
            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 px-3.5 py-2.5 text-xs font-medium placeholder:text-slate-500 shadow-2xs outline-none transition"
          />
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">3. Etude Melodi</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            list="listEtudeMelodi"
            value={etudeMelodi}
            onChange={(e) => setEtudeMelodi(e.target.value)}
            placeholder="Buku melodi..."
            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 px-3.5 py-2.5 text-xs font-medium placeholder:text-slate-500 shadow-2xs outline-none transition"
          />
          <input
            type="text"
            value={etudeMelodiNo}
            onChange={(e) => setEtudeMelodiNo(e.target.value)}
            placeholder="No. Etude"
            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 px-3.5 py-2.5 text-xs font-medium placeholder:text-slate-500 shadow-2xs outline-none transition"
          />
          <input
            type="text"
            value={etudeMelodiStatus}
            onChange={(e) => setEtudeMelodiStatus(e.target.value)}
            placeholder="Status"
            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 px-3.5 py-2.5 text-xs font-medium placeholder:text-slate-500 shadow-2xs outline-none transition"
          />
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">4. Polifonik</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            list="listPolifonik"
            value={polifonik}
            onChange={(e) => setPolifonik(e.target.value)}
            placeholder="Repertoire polifonik..."
            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 px-3.5 py-2.5 text-xs font-medium placeholder:text-slate-500 shadow-2xs outline-none transition"
          />
          <input
            type="text"
            value={polifonikNo}
            onChange={(e) => setPolifonikNo(e.target.value)}
            placeholder="No. (Cth: BWV 847)"
            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 px-3.5 py-2.5 text-xs font-medium placeholder:text-slate-500 shadow-2xs outline-none transition"
          />
          <input
            type="text"
            value={polifonikStatus}
            onChange={(e) => setPolifonikStatus(e.target.value)}
            placeholder="Status"
            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 px-3.5 py-2.5 text-xs font-medium placeholder:text-slate-500 shadow-2xs outline-none transition"
          />
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">5. Sonatina / Sonata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            list="listSonata"
            value={sonata}
            onChange={(e) => setSonata(e.target.value)}
            placeholder="Sonata..."
            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 px-3.5 py-2.5 text-xs font-medium placeholder:text-slate-500 shadow-2xs outline-none transition"
          />
          <input
            type="text"
            value={sonataStatus}
            onChange={(e) => setSonataStatus(e.target.value)}
            placeholder="Status"
            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 px-3.5 py-2.5 text-xs font-medium placeholder:text-slate-500 shadow-2xs outline-none transition"
          />
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">6. Repertoire / Pieces Bebas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={piecesJudul}
            onChange={(e) => setPiecesJudul(e.target.value)}
            placeholder="Judul Pieces"
            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 px-3.5 py-2.5 text-xs font-medium placeholder:text-slate-500 shadow-2xs outline-none transition"
          />
          <input
            type="text"
            value={piecesStatus}
            onChange={(e) => setPiecesStatus(e.target.value)}
            placeholder="Status"
            className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 px-3.5 py-2.5 text-xs font-medium placeholder:text-slate-500 shadow-2xs outline-none transition"
          />
        </div>
      </div>

      <datalist id="listEtudeTeknik">
        {suggestionList.map((item, idx) => item.etude_teknik_judul ? <option key={idx} value={item.etude_teknik_judul} /> : null)}
      </datalist>
      <datalist id="listEtudeMelodi">
        {suggestionList.map((item, idx) => item.etude_melodi_judul ? <option key={idx} value={item.etude_melodi_judul} /> : null)}
      </datalist>
      <datalist id="listPolifonik">
        {suggestionList.map((item, idx) => item.polifonik_judul ? <option key={idx} value={item.polifonik_judul} /> : null)}
      </datalist>
      <datalist id="listSonata">
        {suggestionList.map((item, idx) => item.sonatina_sonata_judul ? <option key={idx} value={item.sonatina_sonata_judul} /> : null)}
      </datalist>

      <button
        type="submit"
        disabled={submitting || !selectedSiswaJurnal}
        className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-semibold py-3.5 px-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-sm shadow-indigo-600/20 disabled:opacity-50"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        <span>Simpan Jurnal Mengajar Siswa</span>
      </button>
    </form>
  );
}