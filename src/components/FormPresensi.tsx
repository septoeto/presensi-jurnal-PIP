import { UserCheck, Check, Send, Loader2 } from "lucide-react";

interface PresensiItem {
  nama: string;
  kelas: string;
  instrument: string;
  status: string;
  keterangan: string;
}

interface FormPresensiProps {
  presensiData: PresensiItem[];
  setPresensiData: (data: PresensiItem[]) => void;
  tanggal: string;
  setTanggal: (val: string) => void;
  jam: string;
  setJam: (val: string) => void;
  selectedKelasPresensi: string;
  setSelectedKelasPresensi: (val: string) => void;
  availableKelas: string[];
  submitting: boolean;
  handleSubmitPresensi: (e: React.FormEvent) => void;
}

export default function FormPresensi({
  presensiData,
  setPresensiData,
  tanggal,
  setTanggal,
  jam,
  setJam,
  selectedKelasPresensi,
  setSelectedKelasPresensi,
  availableKelas,
  submitting,
  handleSubmitPresensi,
}: FormPresensiProps) {
  const handleStatusChange = (index: number, newStatus: string) => {
    const updated = [...presensiData];
    updated[index].status = newStatus;
    setPresensiData(updated);
  };

  const handleKeteranganChange = (index: number, val: string) => {
    const updated = [...presensiData];
    updated[index].keterangan = val;
    setPresensiData(updated);
  };

  const handleHadirSemua = () => {
    const updated = presensiData.map((item) => ({
      ...item,
      status: "Hadir",
    }));
    setPresensiData(updated);
  };

  return (
    <form onSubmit={handleSubmitPresensi} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2.5">
            <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Form Kehadiran Siswa</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">Pilih kelas dan atur status kehadiran siswa bimbingan Anda.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-1">Pilih Kelas</label>
            <select
              value={selectedKelasPresensi}
              onChange={(e) => setSelectedKelasPresensi(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs font-medium shadow-2xs focus:ring-2 focus:ring-indigo-500 outline-none transition"
            >
              <option value="Semua">Semua Kelas</option>
              {availableKelas.map((cls, idx) => (
                <option key={idx} value={cls}>Kelas {cls}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-1">Tanggal</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs font-medium shadow-2xs outline-none transition"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-1">Jam</label>
            <input
              type="time"
              value={jam}
              onChange={(e) => setJam(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs font-medium shadow-2xs outline-none transition"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Menampilkan: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{presensiData.length} Siswa</span>
        </div>
        <button
          type="button"
          onClick={handleHadirSemua}
          className="bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-semibold py-2 px-4 rounded-xl transition shadow-xs flex items-center space-x-1.5"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Hadir Semua</span>
        </button>
      </div>

      {presensiData.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-xs font-medium">Tidak ada data siswa ditemukan untuk kriteria ini.</div>
      ) : (
        <div className="space-y-2.5">
          {presensiData.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 shadow-2xs transition flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5 min-w-[220px]">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-xs shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-tight">{item.nama}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">Kelas {item.kelas} • {item.instrument}</p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
                {["Hadir", "Izin", "Sakit", "Alpha"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(idx, st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shadow-2xs ${
                      item.status === st
                        ? st === "Hadir"
                          ? "bg-emerald-600 text-white shadow-emerald-600/20"
                          : st === "Izin"
                          ? "bg-amber-500 text-white shadow-amber-500/20"
                          : st === "Sakit"
                          ? "bg-sky-500 text-white shadow-sky-500/20"
                          : "bg-rose-600 text-white shadow-rose-600/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/70"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="w-full md:w-60">
                <input
                  type="text"
                  value={item.keterangan}
                  onChange={(e) => handleKeteranganChange(idx, e.target.value)}
                  placeholder="Catatan (Opsional)"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 px-3 py-2 text-xs font-medium placeholder:text-slate-500 dark:placeholder:text-slate-400 shadow-2xs outline-none transition"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || presensiData.length === 0}
        className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-semibold py-3.5 px-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-sm shadow-indigo-600/20 disabled:opacity-50 mt-6"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        <span>Simpan Seluruh Presensi Siswa</span>
      </button>
    </form>
  );
}