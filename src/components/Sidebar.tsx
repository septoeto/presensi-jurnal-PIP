import { UserCheck, BookOpen, ClipboardList, BookMarked, Key, LogOut, Music } from "lucide-react";

interface SidebarProps {
  activeTab: "presensi" | "jurnal" | "rekap" | "rekap-jurnal";
  setActiveTab: (tab: "presensi" | "jurnal" | "rekap" | "rekap-jurnal") => void;
  currentGuru: string | null;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onOpenPasswordModal: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentGuru,
  sidebarOpen,
  setSidebarOpen,
  onOpenPasswordModal,
  onLogout,
}: SidebarProps) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-200 flex flex-col justify-between p-6 shadow-xl transform transition-transform duration-200 ease-in-out md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div>
        <div className="flex items-center space-x-3 mb-8 px-2">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 shadow-inner">
            <Music className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="font-semibold text-sm leading-tight text-white">Praktik Piano</h2>
            <p className="text-[11px] text-slate-400 font-medium">SMKN 2 Kasihan</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Menu Utama</p>
          <button
            onClick={() => { setActiveTab("presensi"); setSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition ${
              activeTab === "presensi" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Form Presensi</span>
          </button>
          <button
            onClick={() => { setActiveTab("jurnal"); setSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition ${
              activeTab === "jurnal" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Form Jurnal Mengajar</span>
          </button>
          <button
            onClick={() => { setActiveTab("rekap"); setSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition ${
              activeTab === "rekap" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Rekap Presensi</span>
          </button>
          <button
            onClick={() => { setActiveTab("rekap-jurnal"); setSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition ${
              activeTab === "rekap-jurnal" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>Rekap Jurnal</span>
          </button>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-800 space-y-3">
        <div className="px-2">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Guru Pengampu:</p>
          <p className="text-xs font-bold text-indigo-300 truncate mt-0.5" title={currentGuru || ""}>{currentGuru}</p>
        </div>

        <button
          onClick={onOpenPasswordModal}
          className="w-full text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-2 border border-slate-700/60 font-medium shadow-2xs"
        >
          <Key className="w-3.5 h-3.5 text-indigo-400" />
          <span>Atur Password</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full text-xs bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-2 border border-rose-900/40 font-medium shadow-2xs"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-400" />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
}