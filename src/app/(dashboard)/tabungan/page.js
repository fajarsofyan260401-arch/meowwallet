"use client";

import React, { useEffect, useState } from "react";
import { Plus, ArrowDownLeft, ArrowUpRight, Trash2, Calendar } from "lucide-react";
import { StrawberryCat, SleepingCat, HappyCat } from "@/components/cats/CatMascots";
import { formatRupiah, formatTanggalID } from "@/lib/formatters";

export default function TabunganPage() {
  const [data, setData] = useState({ goals: [], accounts: [] });
  const [newModal, setNewModal] = useState(false);
  const [transferModal, setTransferModal] = useState(null);
  const [celebrate, setCelebrate] = useState(false);
  const [goalForm, setGoalForm] = useState({ name: "", targetAmount: "", deadline: "", note: "" });
  const [txForm, setTxForm] = useState({ type: "DEPOSIT", accountId: "", amount: "", note: "" });

  async function loadData() {
    const res = await fetch("/api/savings");
    const json = await res.json();
    setData(json);
    if (json.accounts?.[0] && !txForm.accountId) {
      setTxForm((f) => ({ ...f, accountId: json.accounts[0].id }));
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateGoal(e) {
    e.preventDefault();
    const res = await fetch("/api/savings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goalForm),
    });
    if (res.ok) {
      setNewModal(false);
      setGoalForm({ name: "", targetAmount: "", deadline: "", note: "" });
      loadData();
    }
  }

  async function handleTransfer(e) {
    e.preventDefault();
    const res = await fetch("/api/savings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "TRANSFER",
        savingsGoalId: transferModal.id,
        ...txForm,
      }),
    });
    const json = await res.json();
    if (!res.ok) return alert(json.error);
    setTransferModal(null);
    setTxForm({ ...txForm, amount: "", note: "" });
    if (json.goalReached) {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 4000);
    }
    loadData();
  }

  async function handleDelete(id) {
    if (!confirm("Hapus target tabungan ini?")) return;
    await fetch(`/api/savings?id=${id}`, { method: "DELETE" });
    loadData();
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="rounded-card bg-butter-yellow/70 p-6 shadow-kawaii border border-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-dark-brown">Target Tabungan</h1>
          <p className="text-sm text-dark-brown/75">Sisihkan dana impianmu tanpa tercampur saldo harian</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setNewModal(true)}
            className="bg-dark-brown text-white font-bold text-sm px-4 py-2.5 rounded-2xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Target Baru
          </button>
          <StrawberryCat className="w-20 h-20 hidden sm:block" />
        </div>
      </div>

      {celebrate && (
        <div className="rounded-card bg-mint-green p-4 border-2 border-white shadow-kawaii flex items-center gap-4">
          <HappyCat className="w-16 h-16" />
          <div>
            <p className="font-black text-dark-brown">Yeay! Target Tabungan Tercapai! 🎉</p>
            <p className="text-xs font-bold text-dark-brown/75">Meow Saver hebat sekali menabungnya!</p>
          </div>
        </div>
      )}

      {data.goals.length === 0 ? (
        <div className="rounded-card bg-white p-12 text-center shadow-kawaii flex flex-col items-center">
          <SleepingCat className="w-28 h-28" />
          <p className="font-bold text-dark-brown/70 mt-3">Belum ada target tabungan. Yuk buat satu!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.goals.map((g) => {
            const rawPct = Math.round((g.currentAmount / g.targetAmount) * 100);
            const overflow = g.currentAmount - g.targetAmount;
            return (
              <div key={g.id} className="rounded-card bg-white p-5 shadow-kawaii border border-soft-gray flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-extrabold text-lg text-dark-brown">{g.name}</h3>
                      {g.deadline && (
                        <p className="text-xs text-dark-brown/60 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3.5 h-3.5" /> {formatTanggalID(g.deadline)}
                        </p>
                      )}
                    </div>
                    <button onClick={() => handleDelete(g.id)} className="p-1.5 text-[#B84A5E] hover:bg-soft-pink/50 rounded-xl">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="my-4">
                    <div className="flex justify-between text-xs font-extrabold mb-1.5">
                      <span>{formatRupiah(g.currentAmount)}</span>
                      <span className="text-[#3B7A49]">{Math.min(rawPct, 100)}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-soft-gray overflow-hidden">
                      <div className="h-full bg-[#97C79B] rounded-full" style={{ width: `${Math.min(rawPct, 100)}%` }} />
                    </div>
                    <p className="text-xs text-dark-brown/60 mt-1.5">
                      Target: {formatRupiah(g.targetAmount)}
                      {overflow > 0 && <span className="text-[#3B7A49] font-bold"> (+{formatRupiah(overflow)} lebih!)</span>}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-soft-gray">
                  <button
                    onClick={() => {
                      setTransferModal(g);
                      setTxForm({ ...txForm, type: "DEPOSIT" });
                    }}
                    className="py-2 px-3 rounded-xl bg-mint-green text-dark-brown font-extrabold text-xs flex items-center justify-center gap-1"
                  >
                    <ArrowDownLeft className="w-4 h-4" /> Setor
                  </button>
                  <button
                    onClick={() => {
                      setTransferModal(g);
                      setTxForm({ ...txForm, type: "WITHDRAW" });
                    }}
                    className="py-2 px-3 rounded-xl bg-soft-pink text-dark-brown font-extrabold text-xs flex items-center justify-center gap-1"
                  >
                    <ArrowUpRight className="w-4 h-4" /> Tarik
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {newModal && (
        <div className="fixed inset-0 z-50 bg-dark-brown/40 flex items-center justify-center p-4">
          <form onSubmit={handleCreateGoal} className="bg-cream rounded-card p-6 w-full max-w-md space-y-4 border-2 border-white">
            <h2 className="text-xl font-extrabold">Target Tabungan Baru</h2>
            <input required placeholder="Nama Target (mis. Dana Darurat)" value={goalForm.name} onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded-2xl bg-white border border-soft-gray text-sm" />
            <input required type="number" min="1000" placeholder="Nominal Target (Rp)" value={goalForm.targetAmount} onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })} className="w-full px-4 py-2.5 rounded-2xl bg-white border border-soft-gray text-sm" />
            <input type="date" value={goalForm.deadline} onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })} className="w-full px-4 py-2.5 rounded-2xl bg-white border border-soft-gray text-sm" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setNewModal(false)} className="px-4 py-2 rounded-xl bg-soft-gray text-sm font-bold">Batal</button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-dark-brown text-white text-sm font-bold">Simpan</button>
            </div>
          </form>
        </div>
      )}

      {transferModal && (
        <div className="fixed inset-0 z-50 bg-dark-brown/40 flex items-center justify-center p-4">
          <form onSubmit={handleTransfer} className="bg-cream rounded-card p-6 w-full max-w-md space-y-4 border-2 border-white">
            <h2 className="text-xl font-extrabold">
              {txForm.type === "DEPOSIT" ? "Setor ke" : "Tarik dari"} {transferModal.name}
            </h2>
            <select required value={txForm.accountId} onChange={(e) => setTxForm({ ...txForm, accountId: e.target.value })} className="w-full px-4 py-2.5 rounded-2xl bg-white border border-soft-gray text-sm">
              {data.accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name} ({formatRupiah(a.currentBalance)})</option>
              ))}
            </select>
            <input required type="number" min="1" placeholder="Nominal Rupiah" value={txForm.amount} onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })} className="w-full px-4 py-2.5 rounded-2xl bg-white border border-soft-gray text-sm" />
            <input placeholder="Catatan (opsional)" value={txForm.note} onChange={(e) => setTxForm({ ...txForm, note: e.target.value })} className="w-full px-4 py-2.5 rounded-2xl bg-white border border-soft-gray text-sm" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setTransferModal(null)} className="px-4 py-2 rounded-xl bg-soft-gray text-sm font-bold">Batal</button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-dark-brown text-white text-sm font-bold">Konfirmasi</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}