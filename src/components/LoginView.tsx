import { Music, Lock, Key, ShieldCheck } from "lucide-react";

interface LoginViewProps {
  guruList: string[];
  selectedGuruInput: string;
  setSelectedGuruInput: (val: string) => void;
  pinInput: string;
  setPinInput: (val: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  showPasswordModal: boolean;
  setShowPasswordModal: (show: boolean) => void;
  targetGuruPass: string;
  setTargetGuruPass: (val: string) => void;
  inputBaruPass: string;
  setInputBaruPass: (val: string) => void;
  inputBaruNip: string;
  setInputBaruNip: (val: string) => void;
  handleSavePassword: (e: React.FormEvent) => void;
  submitting: boolean;
}

export default function LoginView({
  guruList,
  selectedGuruInput,
  setSelectedGuruInput,
  pinInput,
  setPinInput,
  handleLogin,
  showPasswordModal,
  setShowPasswordModal,
  targetGuruPass,
  setTargetGuruPass,
  inputBaruPass,
  setInputBaruPass,
  inputBaruNip,
  setInputBaruNip,
  handleSavePassword,
  submitting,
}: LoginViewProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/20 relative overflow-hidden">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
        </div>

        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-3 shadow-inner border border-indigo-100">
            <Music className="w-7 h-7 text-indigo-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Guru Praktik (Supabase)</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">SMK Negeri 2 Kasihan • Pilih Nama Guru</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Nama Guru</label>
            <select
              value={selectedGuruInput}
              onChange={(e) => setSelectedGuruInput(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm transition"
            >
              {guruList.map((g, idx) => (
                <option key={idx} value={g} className="text-slate-900 font-medium">
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">PIN / Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                placeholder="Masukkan Password (Default: 1234)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold py-3.5 px-4 rounded-xl transition shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 mt-3"
          >
            <span>Masuk Aplikasi</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            onClick={() => { if(guruList.length > 0) setTargetGuruPass(guruList[0]); setShowPasswordModal(true); }}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center justify-center mx-auto space-x-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Atur / Ubah Password & NIP Guru</span>
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 md:p-8 shadow-2xl space-y-4 border border-slate-100">
            <h3 className="font-bold text-slate-900 text-lg flex items-center space-x-2">
              <Key className="w-5 h-5 text-indigo-600" />
              <span>Pengaturan Guru & NIP</span>
            </h3>

            <form onSubmit={handleSavePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Pilih Guru</label>
                <select
                  value={targetGuruPass}
                  onChange={(e) => setTargetGuruPass(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 bg-white"
                >
                  {guruList.map((g, idx) => (
                    <option key={idx} value={g} className="text-slate-900">{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Password / PIN Baru</label>
                <input
                  type="password"
                  placeholder="Masukkan PIN baru"
                  value={inputBaruPass}
                  onChange={(e) => setInputBaruPass(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nomor Induk Pegawai (NIP)</label>
                <input
                  type="text"
                  placeholder="Masukkan NIP guru"
                  value={inputBaruNip}
                  onChange={(e) => setInputBaruNip(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-sm font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-semibold transition shadow-md shadow-indigo-600/20"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}