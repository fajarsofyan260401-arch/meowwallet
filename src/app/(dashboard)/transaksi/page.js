"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowLeftRight,
} from "lucide-react";
import { ShrimpCat, SleepingCat } from "@/components/cats/CatMascots";
import { formatRupiah, formatTanggalID } from "@/lib/formatters";

export const dynamic = "force-dynamic";

function TransaksiContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState({ transactions: [], accounts: [], categories: [] });
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    type: "EXPENSE",
    title: "",
    amount: "",
    accountId: "",
    toAccountId: "",
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    if (searchParams?.get("new") === "1") {
      setModalOpen(true);
    }
  }, [searchParams]);

  const loadData = () => {
    setLoading(true);
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((json) => {
        const transactions = json.transactions || [];
        const accounts = json.accounts || [];
        const categories = json.categories || [];
        setData({ transactions, accounts, categories });
        setForm((prev) => ({
          ...prev,
          accountId: prev.accountId || accounts[0]?.id || "",
          toAccountId: prev.toAccountId || accounts[1]?.id || accounts[0]?.id || "",
          categoryId:
            prev.categoryId ||
            categories.find((c) => c.type === prev.type)?.id ||
            categories[0]?.id ||
            "",
        }));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTypeChange = (newType) => {
    const firstCat = data.categories.find((c) => c.type === newType);
    setForm((prev) => ({
      ...prev,
      type: newType,
      categoryId: firstCat?.id || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.accountId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
        }),
      });
      if (res.ok) {
        setModalOpen(false);
        setForm((prev) => ({
          ...prev,
          title: "",
          amount: "",
          notes: "",
        }));
        loadData();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus transaksi ini?")) return;
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    loadData();
  };

  const filteredTransactions = data.transactions.filter((trx) => {
    const matchType = !filterType || trx.type === filterType;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      trx.title?.toLowerCase().includes(q) ||
      trx.category?.name?.toLowerCase().includes(q) ||
      trx.account?.name?.toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  const filteredCategories = data.categories.filter((c) => c.type === form.type);

  return (
    <div className="space-y-6 pb-24">
      <div className="rounded-card bg-gradient-to-r from-[#FBE8EC] via-[#FFF4F6] to-[#FFF9F4] p-6 shadow-kawaii border border-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <ShrimpCat className="w-20 h-20 shrink-0" />
          <div>
            <h1 className="text-2xl font-extrabold text-dark-brown">Riwayat Transaksi</h1>
            <p className="text-sm text-dark-brown/70 font-medium">
              Catat pemasukan, pengeluaran, dan pindah saldo kamu~
            </p>
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-dark-brown text-white px-5 py-2.5 text-sm font-bold shadow-kawaii hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" /> Tambah Transaksi
        </button>
      </div>

      <div className="rounded-card bg-white p-4 shadow-kawaii border border-soft-gray flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-dark-brown/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari transaksi, kategori, atau dompet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full bg-cream border border-soft-gray pl-10 pr-4 py-2 text-sm text-dark-brown focus:outline-none"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-full bg-cream border border-soft-gray px-4 py-2 text-sm font-bold text-dark-brown"
        >
          <option value="">Semua Tipe</option>
          <option value="INCOME">Pemasukan</option>
          <option value="EXPENSE">Pengeluaran</option>
          <option value="TRANSFER">Transfer</option>
        </select>
      </div>

      <div className="rounded-card bg-white p-6 shadow-kawaii border border-soft-gray">
        {loading ? (
          <p className="text-center text-dark-brown/70 font-bold py-8">Memuat transaksi...</p>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <SleepingCat className="w-28 h-28" />
            <p className="text-base font-extrabold text-dark-brown mt-2">
              Belum ada transaksi ditemukan
            </p>
            <p className="text-xs text-dark-brown/60 mt-1">
              Klik tombol &quot;Tambah Transaksi&quot; untuk mulai mencatat~
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((trx) => {
              const isIncome = trx.type === "INCOME";
              const isTransfer = trx.type === "TRANSFER";
              return (
                <div
                  key={trx.id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-cream/70 border border-soft-gray/70"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center ${
                        isIncome
                          ? "bg-[#DDEEDC] text-[#3B7A49]"
                          : isTransfer
                          ? "bg-[#DCEFFA] text-[#2F6F95]"
                          : "bg-[#F8DDE3] text-[#B84A5E]"
                      }`}
                    >
                      {isIncome ? (
                        <ArrowUpCircle className="w-5 h-5" />
                      ) : isTransfer ? (
                        <ArrowLeftRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-dark-brown truncate">{trx.title}</p>
                      <p className="text-xs text-dark-brown/60 truncate">
                        {isTransfer ? "Transfer" : trx.category?.name || "Umum"} •{" "}
                        {trx.account?.name}
                        {isTransfer && trx.toAccount?.name ? ` → ${trx.toAccount.name}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p
                        className={`text-sm font-extrabold ${
                          isIncome
                            ? "text-[#3B7A49]"
                            : isTransfer
                            ? "text-[#2F6F95]"
                            : "text-[#B84A5E]"
                        }`}
                      >
                        {isIncome ? "+" : isTransfer ? "" : "-"} {formatRupiah(trx.amount)}
                      </p>
                      <p className="text-[11px] text-dark-brown/50">{formatTanggalID(trx.date)}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(trx.id)}
                      className="p-2 rounded-full text-dark-brown/40 hover:text-[#B84A5E] hover:bg-[#F8DDE3]/50 transition"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-card bg-white p-6 shadow-xl border border-soft-gray space-y-4">
            <h2 className="text-lg font-extrabold text-dark-brown">Catat Transaksi Baru</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "EXPENSE", label: "Pengeluaran" },
                  { id: "INCOME", label: "Pemasukan" },
                  { id: "TRANSFER", label: "Transfer" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTypeChange(t.id)}
                    className={`py-2 rounded-full text-xs font-extrabold border transition ${
                      form.type === t.id
                        ? "bg-dark-brown text-white border-dark-brown"
                        : "bg-cream text-dark-brown border-soft-gray"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-bold text-dark-brown/70">Judul Transaksi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Makan Siang / Gaji"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full mt-1 rounded-2xl bg-cream border border-soft-gray px-3.5 py-2 text-sm text-dark-brown"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-dark-brown/70">Nominal (Rp)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="50000"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full mt-1 rounded-2xl bg-cream border border-soft-gray px-3.5 py-2 text-sm text-dark-brown"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-dark-brown/70">
                    {form.type === "TRANSFER" ? "Dari Dompet" : "Dompet / Akun"}
                  </label>
                  <select
                    required
                    value={form.accountId}
                    onChange={(e) => setForm({ ...form, accountId: e.target.value })}
                    className="w-full mt-1 rounded-2xl bg-cream border border-soft-gray px-3 py-2 text-sm text-dark-brown"
                  >
                    {data.accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                </div>

                {form.type === "TRANSFER" ? (
                  <div>
                    <label className="text-xs font-bold text-dark-brown/70">Ke Dompet</label>
                    <select
                      required
                      value={form.toAccountId}
                      onChange={(e) => setForm({ ...form, toAccountId: e.target.value })}
                      className="w-full mt-1 rounded-2xl bg-cream border border-soft-gray px-3 py-2 text-sm text-dark-brown"
                    >
                      {data.accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-dark-brown/70">Kategori</label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                      className="w-full mt-1 rounded-2xl bg-cream border border-soft-gray px-3 py-2 text-sm text-dark-brown"
                    >
                      {filteredCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-dark
