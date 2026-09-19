"use client";

import { useState, useEffect } from "react";
import { Menu, X, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

import Sidebar from "../components/Sidebar";
import LoginView from "../components/LoginView";
import FormPresensi from "../components/FormPresensi";
import FormJurnal from "../components/FormJurnal";
import RekapPresensi from "../components/RekapPresensi";
import RekapJurnal from "../components/RekapJurnal";

interface Siswa {
  nama_siswa: string;
  kelas: string;
  guru: string;
  instrument: string;
}

interface Suggestion {
  etude_teknik_judul?: string;
  opus?: string;
  komponis?: string;
  etude_melodi_judul?: string;
  opus_1?: string;
  komponis_1?: string;
  polifonik_judul?: string;
  komponis_2?: string;
  sonatina_sonata_judul?: string;
  opus_2?: string;
  komponis_3?: string;
}

interface GuruData {
  nama_guru: string;
  password: string;
  nip?: string;
}

interface PresensiItem {
  nama: string;
  kelas: string;
  instrument: string;
  status: string;
  keterangan: string;
}

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

export default function Home() {
  const [currentGuru, setCurrentGuru] = useState<string | null>(null);
  const [guruList, setGuruList] = useState<string[]>([]);
  const [guruPassList, setGuruPassList] = useState<GuruData[]>([]);
  
  const [selectedGuruInput, setSelectedGuruInput] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form Atur Password State
  const [targetGuruPass, setTargetGuruPass] = useState("");
  const [inputBaruPass, setInputBaruPass] = useState("");
  const [inputBaruNip, setInputBaruNip] = useState("");

  const [activeTab, setActiveTab] = useState<"presensi" | "jurnal" | "rekap" | "rekap-jurnal">("presensi");
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [suggestionList, setSuggestionList] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Modern Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Presensi State
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [jam, setJam] = useState(new Date().toTimeString().slice(0, 5));
  const [selectedKelasPresensi, setSelectedKelasPresensi] = useState("Semua");
  const [presensiData, setPresensiData] = useState<PresensiItem[]>([]);

  // Rekap Presensi State & Filter Waktu
  const [rekapList, setRekapList] = useState<RekapPresensiRow[]>([]);
  const [selectedKelasRekap, setSelectedKelasRekap] = useState("Semua");
  const [filterMode, setFilterMode] = useState<"semua" | "mingguan" | "bulanan">("semua");
  const [selectedBulan, setSelectedBulan] = useState(new Date().toISOString().slice(0, 7));
  const [selectedMinggu, setSelectedMinggu] = useState(() => {
    const now = new Date();
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  });
  const [loadingRekap, setLoadingRekap] = useState(false);

  // Jurnal State
  const [selectedKelasJurnal, setSelectedKelasJurnal] = useState("");
  const [selectedSiswaJurnal, setSelectedSiswaJurnal] = useState<Siswa | null>(null);
  const [tangganada, setTangganada] = useState("");
  const [tangganadaStatus, setTangganadaStatus] = useState("");
  const [etudeTeknik, setEtudeTeknik] = useState("");
  const [etudeTeknikNo, setEtudeTeknikNo] = useState("");
  const [etudeTeknikStatus, setEtudeTeknikStatus] = useState("");
  const [etudeMelodi, setEtudeMelodi] = useState("");
  const [etudeMelodiNo, setEtudeMelodiNo] = useState("");
  const [etudeMelodiStatus, setEtudeMelodiStatus] = useState("");
  const [polifonik, setPolifonik] = useState("");
  const [polifonikNo, setPolifonikNo] = useState("");
  const [polifonikStatus, setPolifonikStatus] = useState("");
  const [sonata, setSonata] = useState("");
  const [sonataKomponis, setSonataKomponis] = useState("");
  const [sonataMov, setSonataMov] = useState("");
  const [sonataStatus, setSonataStatus] = useState("");
  const [piecesJudul, setPiecesJudul] = useState("");
  const [piecesKomponis, setPiecesKomponis] = useState("");
  const [piecesStatus, setPiecesStatus] = useState("");

  useEffect(() => {
    const savedGuru = localStorage.getItem("currentGuru");
    if (savedGuru) {
      setCurrentGuru(savedGuru);
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [resSiswa, resSugg, resGuru] = await Promise.all([
        supabase.from("siswa").select("*"),
        supabase.from("suggestion").select("*"),
        supabase.from("guru").select("*")
      ]);

      const siswa = resSiswa.data || [];
      const suggestion = resSugg.data || [];
      const guruRows = resGuru.data || [];

      const gList: string[] = [];
      const gPassList: GuruData[] = [];

      guruRows.forEach((g: any) => {
        if (g.nama_guru) {
          gList.push(g.nama_guru);
          gPassList.push({ 
            nama_guru: String(g.nama_guru), 
            password: String(g.password || "1234"),
            nip: String(g.nip || "-")
          });
        }
      });

      setSiswaList(siswa);
      setSuggestionList(suggestion);
      setGuruList(gList);
      setGuruPassList(gPassList);

      if (gList.length > 0) {
        setSelectedGuruInput(gList[0]);
        if (!targetGuruPass) {
          setTargetGuruPass(gList[0]);
        }
      }
    } catch (err) {
      console.error("Gagal memuat data dari Supabase:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRekapPresensi = async () => {
    if (!currentGuru) return;
    setLoadingRekap(true);
    try {
      const { data, error } = await supabase
        .from("presensi")
        .select("*")
        .ilike("guru", currentGuru)
        .order("tanggal", { ascending: false })
        .order("jam", { ascending: false });

      if (error) throw error;
      setRekapList(data || []);
    } catch (err) {
      console.error("Gagal memuat rekap presensi:", err);
    } finally {
      setLoadingRekap(false);
    }
  };

  useEffect(() => {
    if (activeTab === "rekap" && currentGuru) {
      fetchRekapPresensi();
    }
  }, [activeTab, currentGuru]);

  const guruSiswaList = siswaList.filter(
    (s) => s.guru?.trim().toLowerCase() === currentGuru?.trim().toLowerCase()
  );

  const availableKelas = Array.from(new Set(guruSiswaList.map((s) => s.kelas?.trim()))).filter(Boolean);

  const filteredSiswaPresensi = guruSiswaList.filter((s) => {
    if (selectedKelasPresensi === "Semua") return true;
    return s.kelas?.trim() === selectedKelasPresensi;
  });

  const getWeekNumber = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
  };

  const filteredRekapList = rekapList.filter((item) => {
    const matchKelas = selectedKelasRekap === "Semua" || item.kelas?.trim() === selectedKelasRekap;
    if (!matchKelas) return false;

    if (filterMode === "bulanan") {
      return item.tanggal && item.tanggal.startsWith(selectedBulan);
    } else if (filterMode === "mingguan") {
      const itemWeek = getWeekNumber(item.tanggal);
      return itemWeek === selectedMinggu;
    }
    return true;
  });

  useEffect(() => {
    if (filteredSiswaPresensi.length > 0) {
      const initial = filteredSiswaPresensi.map((s) => ({
        nama: s.nama_siswa,
        kelas: s.kelas || "-",
        instrument: s.instrument || "Piano",
        status: "Hadir",
        keterangan: "-",
      }));
      setPresensiData(initial);
    } else {
      setPresensiData([]);
    }
  }, [selectedKelasPresensi, currentGuru, siswaList]);

  useEffect(() => {
    if (availableKelas.length > 0) {
      setSelectedKelasJurnal(availableKelas[0]);
    } else {
      setSelectedKelasJurnal("");
    }
  }, [currentGuru, siswaList]);

  const filteredSiswaByKelasJurnal = guruSiswaList.filter(
    (s) => s.kelas?.trim() === selectedKelasJurnal
  );

  useEffect(() => {
    if (filteredSiswaByKelasJurnal.length > 0) {
      setSelectedSiswaJurnal(filteredSiswaByKelasJurnal[0]);
    } else {
      setSelectedSiswaJurnal(null);
    }
  }, [selectedKelasJurnal, currentGuru]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuruInput) return;

    const foundPassObj = guruPassList.find(
      (g) => String(g.nama_guru).trim().toLowerCase() === selectedGuruInput.trim().toLowerCase()
    );
    const dbPassword = foundPassObj?.password ? String(foundPassObj.password).trim() : "1234";

    if (pinInput.trim() !== dbPassword) {
      showToast("Password / PIN salah! (Default PIN jika belum diatur: 1234)", "error");
      return;
    }

    setCurrentGuru(selectedGuruInput);
    localStorage.setItem("currentGuru", selectedGuruInput);
    showToast(`Selamat datang, ${selectedGuruInput}!`);
  };

  const handleLogout = () => {
    setCurrentGuru(null);
    localStorage.removeItem("currentGuru");
    showToast("Berhasil keluar sesi.");
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetGuruPass) return;

    setSubmitting(true);
    try {
      const { data: existing } = await supabase
        .from("guru")
        .select("*")
        .ilike("nama_guru", targetGuruPass)
        .single();

      const updatePayload: any = {};
      if (inputBaruPass) updatePayload.password = inputBaruPass;
      if (inputBaruNip) updatePayload.nip = inputBaruNip;

      if (existing) {
        await supabase
          .from("guru")
          .update(updatePayload)
          .eq("id", existing.id);
      } else {
        await supabase
          .from("guru")
          .insert([{ nama_guru: targetGuruPass, password: inputBaruPass || "1234", nip: inputBaruNip || "-" }]);
      }

      showToast("Data guru berhasil disimpan ke Supabase!");
      setShowPasswordModal(false);
      setInputBaruPass("");
      setInputBaruNip("");
      fetchAllData();
    } catch (err) {
      showToast("Gagal menyimpan data guru.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitPresensi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGuru || presensiData.length === 0) return;
    setSubmitting(true);

    const payload = presensiData.map((item) => ({
      tanggal,
      jam,
      kelas: item.kelas,
      nama_siswa: item.nama,
      instrument: item.instrument,
      guru: currentGuru,
      status: item.status,
      keterangan: item.keterangan || "-"
    }));

    try {
      const { error } = await supabase.from("presensi").insert(payload);
      if (error) throw error;

      showToast("Seluruh presensi siswa berhasil disimpan ke Supabase!");
    } catch (err: any) {
      showToast("Terjadi kesalahan saat menyimpan presensi: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitJurnal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiswaJurnal || !currentGuru) return;
    setSubmitting(true);

    const payload = {
      tanggal,
      kelas: selectedSiswaJurnal.kelas,
      nama_siswa: selectedSiswaJurnal.nama_siswa,
      instrument: selectedSiswaJurnal.instrument,
      guru: currentGuru,
      tangganada,
      tangganada_status: tangganadaStatus,
      etude_teknik: etudeTeknik,
      etude_teknik_no: etudeTeknikNo,
      etude_teknik_status: etudeTeknikStatus,
      etude_melodi: etudeMelodi,
      etude_melodi_no: etudeMelodiNo,
      etude_melodi_status: etudeMelodiStatus,
      polifonik,
      polifonik_no: polifonikNo,
      polifonik_status: polifonikStatus,
      sonata,
      sonata_komponis: sonataKomponis,
      sonata_mov: sonataMov,
      sonata_status: sonataStatus,
      pieces_judul: piecesJudul,
      pieces_komponis: piecesKomponis,
      pieces_status: piecesStatus
    };

    try {
      const { error } = await supabase.from("jurnal").insert([payload]);
      if (error) throw error;

      showToast("Jurnal Mengajar berhasil disimpan ke Supabase!");
    } catch (err: any) {
      showToast("Terjadi kesalahan saat menyimpan jurnal: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentGuru) {
    return (
      <>
        <LoginView
          guruList={guruList}
          selectedGuruInput={selectedGuruInput}
          setSelectedGuruInput={setSelectedGuruInput}
          pinInput={pinInput}
          setPinInput={setPinInput}
          handleLogin={handleLogin}
          showPasswordModal={showPasswordModal}
          setShowPasswordModal={setShowPasswordModal}
          targetGuruPass={targetGuruPass}
          setTargetGuruPass={setTargetGuruPass}
          inputBaruPass={inputBaruPass}
          setInputBaruPass={setInputBaruPass}
          inputBaruNip={inputBaruNip}
          setInputBaruNip={setInputBaruNip}
          handleSavePassword={handleSavePassword}
          submitting={submitting}
        />
        {/* Floating Modern Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md ${toast.type === "success" ? "bg-slate-900/90 text-white border-slate-700" : "bg-rose-950/90 text-rose-100 border-rose-800"}`}>
              {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              <span className="text-xs font-semibold">{toast.message}</span>
            </div>
          </div>
        )}
      </>
    );
  }

  const currentGuruObj = guruPassList.find(
    (g) => g.nama_guru?.trim().toLowerCase() === currentGuru?.trim().toLowerCase()
  );
  const currentGuruNip = currentGuruObj?.nip || "-";

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-slate-100 text-slate-900 relative">
      <div className="md:hidden p-4 flex items-center justify-between bg-slate-900 text-white shadow-md">
        <span className="font-semibold text-sm">Piano SMKN 2 Kasihan</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg text-slate-300 hover:bg-slate-800">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentGuru={currentGuru}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onOpenPasswordModal={() => { setTargetGuruPass(currentGuru || ""); setShowPasswordModal(true); }}
        onLogout={handleLogout}
      />

      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-10 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-3">
            <p className="text-sm font-medium text-slate-500">Memuat data dari Supabase...</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 w-full border border-slate-200/80">
            {activeTab === "presensi" && (
              <FormPresensi
                presensiData={presensiData}
                setPresensiData={setPresensiData}
                tanggal={tanggal}
                setTanggal={setTanggal}
                jam={jam}
                setJam={setJam}
                selectedKelasPresensi={selectedKelasPresensi}
                setSelectedKelasPresensi={setSelectedKelasPresensi}
                availableKelas={availableKelas}
                submitting={submitting}
                handleSubmitPresensi={handleSubmitPresensi}
              />
            )}

            {activeTab === "jurnal" && (
              <FormJurnal
                tanggal={tanggal}
                setTanggal={setTanggal}
                availableKelas={availableKelas}
                selectedKelasJurnal={selectedKelasJurnal}
                setSelectedKelasJurnal={setSelectedKelasJurnal}
                filteredSiswaByKelasJurnal={filteredSiswaByKelasJurnal}
                selectedSiswaJurnal={selectedSiswaJurnal}
                setSelectedSiswaJurnal={setSelectedSiswaJurnal}
                suggestionList={suggestionList}
                tangganada={tangganada}
                setTangganada={setTangganada}
                tangganadaStatus={tangganadaStatus}
                setTangganadaStatus={setTangganadaStatus}
                etudeTeknik={etudeTeknik}
                setEtudeTeknik={setEtudeTeknik}
                etudeTeknikNo={etudeTeknikNo}
                setEtudeTeknikNo={setEtudeTeknikNo}
                etudeTeknikStatus={etudeTeknikStatus}
                setEtudeTeknikStatus={setEtudeTeknikStatus}
                etudeMelodi={etudeMelodi}
                setEtudeMelodi={setEtudeMelodi}
                etudeMelodiNo={etudeMelodiNo}
                setEtudeMelodiNo={setEtudeMelodiNo}
                etudeMelodiStatus={etudeMelodiStatus}
                setEtudeMelodiStatus={setEtudeMelodiStatus}
                polifonik={polifonik}
                setPolifonik={setPolifonik}
                polifonikNo={polifonikNo}
                setPolifonikNo={setPolifonikNo}
                polifonikStatus={polifonikStatus}
                setPolifonikStatus={setPolifonikStatus}
                sonata={sonata}
                setSonata={setSonata}
                sonataKomponis={sonataKomponis}
                setSonataKomponis={setSonataKomponis}
                sonataMov={sonataMov}
                setSonataMov={setSonataMov}
                sonataStatus={sonataStatus}
                setSonataStatus={setSonataStatus}
                piecesJudul={piecesJudul}
                setPiecesJudul={setPiecesJudul}
                piecesKomponis={piecesKomponis}
                setPiecesKomponis={setPiecesKomponis}
                piecesStatus={piecesStatus}
                setPiecesStatus={setPiecesStatus}
                submitting={submitting}
                handleSubmitJurnal={handleSubmitJurnal}
              />
            )}

            {activeTab === "rekap" && (
              <RekapPresensi
                loadingRekap={loadingRekap}
                filteredRekapList={filteredRekapList}
                filterMode={filterMode}
                setFilterMode={setFilterMode}
                selectedBulan={selectedBulan}
                setSelectedBulan={setSelectedBulan}
                selectedMinggu={selectedMinggu}
                setSelectedMinggu={setSelectedMinggu}
                selectedKelasRekap={selectedKelasRekap}
                setSelectedKelasRekap={setSelectedKelasRekap}
                availableKelas={availableKelas}
                currentGuru={currentGuru}
                currentGuruNip={currentGuruNip}
              />
            )}

            {activeTab === "rekap-jurnal" && (
              <RekapJurnal
                currentGuru={currentGuru}
                currentGuruNip={currentGuruNip}
                siswaList={siswaList}
                availableKelas={availableKelas}
              />
            )}
          </div>
        )}
      </main>

      {/* Floating Modern Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md ${toast.type === "success" ? "bg-slate-900/95 text-white border-slate-700" : "bg-rose-950/95 text-rose-100 border-rose-800"}`}>
            {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            <span className="text-xs font-semibold">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}