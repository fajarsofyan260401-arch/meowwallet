"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Sparkles, Download, Upload, LogOut, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { SharkCat } from "@/components/cats/CatMascots";
import { formatRupiah } from "@/lib/formatters";

export default function PengaturanPage() {
  const router = useRouter();
  const [data, setData] = useState({ user: null, accounts: [] });
  const [accForm, setAccForm] = useState({ name: "", type: "BANK", initialBalance: "" });
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [restoring, setRestoring] = useState(false);

  async function loadData() {
    const res = await fetch("/api/accounts");
    const json = await res.json();
    setData(json);
    if (json.user) {
      setProfileForm((f) => ({
        ...f,
        name: json.user.name || "",
        email: json.user.email || "",
      }));
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleUpdateProfile(e) {
    e.preventDefault();
    const res = await fetch("/api/accounts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileForm),
    });
    const json = await res.json();
    if (!res.ok) return alert(json.error);

    alert("Akun & password berhasil diperbarui! Silakan login ulang.");
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "LOGOUT" }),
    });
    router.push("/login");
    router.refresh();
  }

  async function handleAddAccount(e) {
    e.preventDefault();
    await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(accForm),
    });
    setAccForm({ name: "", type: "BANK", initialBalance: "" });
    loadData();
  }

  async function handleClearDemo() {
    if (!confirm("Hapus seluruh data demo bawaan? Data asli kamu tetap aman.")) return;
    await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "CLEAR_DEMO" }),
    });
    alert("Data demo berhasil dibersihkan!");
    loadData();
  }

  async function handleDeleteAcc(id) {
    if (!confirm("Hapus rekening ini?")) return;
    await fetch(`/api/accounts?id=${id}`, { method: "DELETE" });
    loadData();
  }

  async function handleRestore(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!confirm("Timpa database saat ini dengan file backup yang dipilih?")) return;

    setRestoring(true);
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/backup", { method: "POST", body: fd });
    const json = await res.json();
    setRestoring(false);

    if (!res.ok) return alert(json.error);
    alert("Database berhasil dipulihkan! Halaman akan dimuat ulang.");
    window.location.reload();
  }

  async function handleLogout() {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "LOGOUT" }),
    });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="rounded-card bg-cream p-6 shadow-kawaii border border-soft-gray flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-dark-brown">Pengaturan & Akun</h1>
          <p className="text-sm text-dark-brown/75">Mata Uang: Rupiah (IDR) • Zona Waktu: Asia/Jakarta</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleLogout} className="px-4 py-2.5 rounded-2xl bg-white border border-soft-gray text-xs font-extrabold text-[#B84A5E] flex items-center gap-1.5 hover:bg-soft-pink/40">
            <LogOut className="w-4 h-4" /> Keluar Akun
          </button>
          <SharkCat className="w-16 h-16 hidden sm:block" />
        </div>
      </div>

      {/* Pengaturan Akun & Password */}
      <div className="rounded-card bg-white p-6 shadow-kawaii space-y-4">
        <h2 className="font-extrabold text-lg flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-[#D96B7E]" /> Ubah Profil & Password Login
        </h2>
        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            required
            placeholder="Nama Tampilan"
            value={profileForm.name}
            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
            className="px-4 py-2.5 rounded-2xl bg-cream border border-soft-gray text-sm"
          />
          <input
            required
            type="email"
            placeholder="Email Login"
            value={profileForm.email}
            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            className="px-4 py-2.5 rounded-2xl bg-cream border border-soft-gray text-sm"
          />
          <input
            type="password"
            placeholder="Password Lama (isi jika ingin ganti password)"
            value={profileForm.currentPassword}
            onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
            className="px-4 py-2.5 rounded-2xl bg-cream border border-soft-gray text-sm"
          />
          <input
            type="password"
            placeholder="Password Baru (minimal 6 karakter)"
            value={profileForm.newPassword}
            onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
            className="px-4 py-2.5 rounded-2xl bg-cream border border-soft-gray text-sm"
          />
          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" className="bg-dark-brown text-white font-bold text-sm rounded-2xl px-5 py-2.5">
              Simpan Perubahan Akun
            </button>
          </div>
        </form>
      </div>

      {/* Manajemen Rekening */}
      <div className="rounded-card bg-white p-6 shadow-kawaii space-y-4">
        <h2 className="font-extrabold text-lg">Manajemen Rekening</h2>
        <form onSubmit={handleAddAccount} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input required placeholder="Nama (mis. Mandiri / DANA)" value={accForm.name} onChange={(e) => setAccForm({ ...accForm, name: e.target.value })} className="px-4 py-2.5 rounded-2xl bg-cream border border-soft-gray text-sm" />
          <select value={accForm.type} onChange={(e) => setAccForm({ ...accForm, type: e.target.value })} className="px-4 py-2.5 rounded-2xl bg-cream border border-soft-gray text-sm">
            <option value="BANK">Rekening Bank</option>
            <option value="EWALLET">E-Wallet</option>
            <option value="CASH">Uang Tunai</option>
          </select>
          <input type="number" placeholder="Saldo Awal (Rp)" value={accForm.initialBalance} onChange={(e) => setAccForm({ ...accForm, initialBalance: e.target.value })} className="px-4 py-2.5 rounded-2xl bg-cream border border-soft-gray text-sm" />
          <button type="submit" className="bg-dark-brown text-white font-bold text-sm rounded-2xl py-2.5 flex items-center justify-center gap-1">
            <Plus className="w-4 h-4" /> Tambah Rekening
          </button>
        </form>

        <div className="space-y-2 pt-2">
          {data.accounts.map((acc) => (
            <div key={acc.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-cream/70">
              <div>
                <p className="font-extrabold text-sm">{acc.name}</p>
                <p className="text-xs text-dark-brown/60">{acc.type}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-sm">{formatRupiah(acc.currentBalance)}</span>
                <button onClick={() => handleDeleteAcc(acc.id)} className="p-2 text-[#B84A5E] hover:bg-soft-pink/50 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backup & Restore Database */}
      <div className="rounded-card bg-pastel-blue/50 p-6 shadow-kawaii border border-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-base">Backup & Restore Database</h3>
          <p className="text-xs text-dark-brown/75">Simpan cadangan file SQLite (.db) ke komputermu atau pulihkan dari cadangan</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/api/backup" className="bg-white text-dark-brown font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-1.5 hover:bg-cream">
            <Download className="w-4 h-4" /> Download Backup
          </a>
          <label className="cursor-pointer bg-dark-brown text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-1.5">
            <Upload className="w-4 h-4" /> {restoring ? "Memulihkan..." : "Restore (.db)"}
            <input type="file" accept=".db,.sqlite" onChange={handleRestore} className="hidden" />
          </label>
        </div>
      </div>

      {/* Hapus Data Demo */}
      <div className="rounded-card bg-soft-pink/50 p-6 shadow-kawaii border border-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-base">Bersihkan Data Demo</h3>
          <p className="text-xs text-dark-brown/75">Hapus seluruh transaksi, tabungan, dan aset contoh bawaan seed</p>
        </div>
        <button onClick={handleClearDemo} className="bg-[#B84A5E] text-white font-bold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Hapus Data Demo
        </button>
      </div>
    </div>
  );
}