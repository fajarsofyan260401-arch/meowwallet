"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Search, Trash2, ArrowUpCircle, ArrowDownCircle, ArrowLeftRight } from "lucide-react";
import { ShrimpCat, SleepingCat } from "@/components/cats/CatMascots";
import { formatRupiah, formatTanggalID } from "@/lib/formatters";

export default function TransaksiPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState({ transactions: [], accounts: [], categories: [] });
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [modalOpen, setModalOpen] = useState(searchParams.get("new") === "1");
  const [form, setForm] = useState({
    type: "EXPENSE",
    title: "",
    amount: "",
    categoryId: "",
    accountId: "",
    destinationAccountId: "",
    date: new Date().toISOString().slice(0, 10),
    note: "",
  });

  async function fetchData() {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (filterType) params.set("type", filterType);
    const res = await fetch(`/api/transactions?${params.toString()}`);
    const json = await res.json();
    setData(json);
    if (json.accounts?.[0] && !form.accountId) {
      setForm((f) => ({ ...f, accountId: json.accounts[0].id }));
    }
  }

  useEffect(() => {
    fetchData();
  }, [search, filterType]);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await res.json();
    if (!res.ok) return alert(result.error);
    setModalOpen(false);
    setForm({ ...form, title: "", amount: "", note: "" });
    fetchData();
  }

  async function handleDelete(id) {
    if (!confirm("Hapus transaksi ini dan kembalikan saldo rekening?")) return;
    await fetch(`/api/transactions?id=${id}`, { method: "DELETE" });
    fetchData();
  }

  const filteredCategories = data.categories.filter((c) => c.type === form.type);

  return (
    <div className="space-y-6 pb-24">
      <div className="rounded-card bg-soft-pink/60 p-6 shadow-kawaii border border-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-dark-brown">Catatan Transaksi</h1>
          <p className="text-sm text-dark-brown/75">Kelola pemasukan, pengeluaran, dan transfer antar rekening</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-dark-brown text-white font-bold text-sm px-4 py-2.5 rounded-2xl flex items-center gap-2 hover:opacity-90"
          >
            <Plus className="w-4 h-4" /> Catat Baru
          </button>
          <ShrimpCat className="w-20 h-20 hidden sm:block" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-dark-brown/50" />
          <input
            type="text"
            placeholder="Cari nama transaksi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-soft-gray text-sm font-semibold"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2.5 rounded-2xl bg-white border border-soft-gray text-sm font-bold"
        >
          <option value="">Semua Jenis</option>
          <option value="INCOME">Pemasukan</option>
          <option value="EXPENSE">Pengeluaran</option>
          <option value="TRANSFER">Transfer Rekening</option>
        </select>
      </div>

      <div className="rounded-card bg-white p-5 shadow-kawaii border border-soft-gray space-y-3">
        {data.transactions.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <SleepingCat className="w-28 h-28" />
            <p className="font-bold text-dark-brown/70 mt-2">Belum ada transaksi yang sesuai filter</p>
          </div>
        ) : (
          data.transactions.map((trx) => {
            const isIncome = trx.type === "INCOME";
            const isTransfer = trx.type === "TRANSFER";
            return (
              <div key={trx.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-cream/70">
                <div className="flex items-center gap-3">
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    isTransfer ? "bg-pastel-blue text-dark-brown" : isIncome ? "bg-mint-green text-[#3B7A49]" : "bg-soft-pink text-[#B84A5E]"
                  }`}>
                    {isTransfer ? <ArrowLeftRight className="w-4 h-4" /> : isIncome ? <ArrowUpCircle className="w-4 h-4" /> : <ArrowDownCircle className="w-4 h-4" />}
                  </span>
                  <div>
                    <p className="font-extrabold text-sm">{trx.title}</p>
                    <p className="text-xs text-dark-brown/60">
                      {isTransfer ? `${trx.account?.name} → ${trx.destinationAccount?.name}` : `${trx.category?.name || "-"} • ${trx.account?.name}`} • {formatTanggalID(trx.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-extrabold text-sm ${isTransfer ? "text-dark-brown" : isIncome ? "text-[#3B7A49]" : "text-[#B84A5E]"}`}>
                    {isTransfer ? "" : isIncome ? "+" : "-"} {formatRupiah(trx.amount)}
                  </span>
                  <button onClick={() => handleDelete(trx.id)} className="p-2 rounded-xl hover:bg-soft-pink/60 text-[#B84A5E]">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-dark-brown/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-cream rounded-card p-6 w-full max-w-md shadow-xl border-2 border-white space-y-4">
            <h2 className="text-xl font-extrabold">Tambah Transaksi Baru</h2>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "EXPENSE", label: "Pengeluaran" },
                { id: "INCOME", label: "Pemasukan" },
                { id: "TRANSFER", label: "Transfer" },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setForm({ ...form, type: t.id, categoryId: "" })}
                  className={`py-2 rounded-xl text-xs font-extrabold border ${
                    form.type === t.id ? "bg-pastel-blue border-dark-brown/20" : "bg-white border-soft-gray"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <input
              required
              placeholder="Judul transaksi (mis. Makan Siang / Gaji)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-white border border-soft-gray text-sm"
            />

            <input
              required
              type="number"
              min="1"
              placeholder="Nominal Rupiah (contoh: 50000)"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-white border border-soft-gray text-sm"
            />

            {form.type !== "TRANSFER" && (
              <select
                required
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-white border border-soft-gray text-sm"
              >
                <option value="">Pilih Kategori</option>
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}

            <select
              required
              value={form.accountId}
              onChange={(e) => setForm({ ...form, accountId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-white border border-soft-gray text-sm"
            >
              {data.accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name} ({formatRupiah(a.currentBalance)})</option>
              ))}
            </select>

            {form.type === "TRANSFER" && (
              <select
                required
                value={form.destinationAccountId}
                onChange={(e) => setForm({ ...form, destinationAccountId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-white border border-soft-gray text-sm"
              >
                <option value="">Pilih Rekening Tujuan</option>
                {data.accounts.filter((a) => a.id !== form.accountId).map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            )}

            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-white border border-soft-gray text-sm"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-soft-gray text-sm font-bold">
                Batal
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-dark-brown text-white text-sm font-bold">
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}