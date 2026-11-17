"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  PiggyBank,
  Target,
  Calendar,
  ChevronRight,
  PawPrint,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { SharkCat, StrawberryCat, ShrimpCat, SleepingCat } from "@/components/cats/CatMascots";
import { formatRupiah, formatTanggalID } from "@/lib/formatters";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState("monthly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/dashboard?period=${period}`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .finally(() => setLoading(false));
  }, [period]);

  if (loading || !data || data.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <SharkCat className="w-28 h-28 animate-bounce" />
        <p className="text-dark-brown font-bold text-lg">Menyiapkan catatan keuanganmu, meow~</p>
      </div>
    );
  }

  const { summary, chartData, savingsSummary, savingsGoals, recentTransactions } = data;

  return (
    <div className="space-y-6 pb-24">
      <div className="relative rounded-card bg-gradient-to-r from-[#DCEFFA] via-[#EBF6FC] to-[#FFF9F4] p-6 shadow-kawaii border border-white/80 overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-dark-brown tracking-tight">
            Hai, {data.userName || "Meow Saver"}! 👋
          </h1>
          <p className="text-dark-brown/75 font-medium mt-1">
            Yuk, cek keuangan kamu hari ini~
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-left md:text-right">
            <span className="text-xs font-bold uppercase tracking-wider text-dark-brown/60">
              Total Kekayaan Bersih
            </span>
            <p className="text-lg font-extrabold text-dark-brown">
              {formatRupiah(summary.netWorth)}
            </p>
          </div>
          <SharkCat className="w-24 h-24 -my-3 drop-shadow-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-card bg-[#E4F2E7] p-5 shadow-kawaii border border-white flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-dark-brown/80 font-bold text-sm">
              <span className="p-1.5 rounded-xl bg-white/80">
                <Wallet className="w-4 h-4 text-[#4C8C5A]" />
              </span>
              Total Saldo
            </div>
            <p className="text-2xl font-extrabold text-dark-brown mt-2">
              {formatRupiah(summary.availableBalance)}
            </p>
            <span className="inline-block mt-2 text-xs font-bold px-2.5 py-1 rounded-full bg-white/80 text-[#3B7A49]">
              Saldo siap pakai
            </span>
          </div>
          <SharkCat className="w-20 h-20 shrink-0" />
        </div>

        <div className="rounded-card bg-[#EEF7EE] p-5 shadow-kawaii border border-white flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-dark-brown/80 font-bold text-sm">
              <span className="p-1.5 rounded-xl bg-[#4C8C5A] text-white">
                <ArrowUpCircle className="w-4 h-4" />
              </span>
              Pemasukan
            </div>
            <p className="text-xl font-extrabold text-dark-brown mt-2">
              {formatRupiah(summary.totalIncome)}
            </p>
            <span className="inline-block mt-2 text-xs font-bold text-[#3B7A49]">
              {summary.incomeDeltaLabel}
            </span>
          </div>
          <StrawberryCat className="w-16 h-16 shrink-0" />
        </div>

        <div className="rounded-card bg-[#FBE8EC] p-5 shadow-kawaii border border-white flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-dark-brown/80 font-bold text-sm">
              <span className="p-1.5 rounded-xl bg-[#D96B7E] text-white">
                <ArrowDownCircle className="w-4 h-4" />
              </span>
              Pengeluaran
            </div>
            <p className="text-xl font-extrabold text-dark-brown mt-2">
              {formatRupiah(summary.totalExpense)}
            </p>
            <span className="inline-block mt-2 text-xs font-bold text-[#B84A5E]">
              {summary.expenseDeltaLabel}
            </span>
          </div>
          <ShrimpCat className="w-16 h-16 shrink-0" />
        </div>

        <div className="rounded-card bg-[#FFF4D6] p-5 shadow-kawaii border border-white flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-dark-brown/80 font-bold text-sm">
              <span className="p-1.5 rounded-xl bg-[#E6B84C] text-white">
                <PiggyBank className="w-4 h-4" />
              </span>
              Tabungan
            </div>
            <p className="text-xl font-extrabold text-dark-brown mt-2">
              {formatRupiah(summary.totalSavings)}
            </p>
            <span className="inline-block mt-2 text-xs font-bold text-[#9E7519]">
              {savingsGoals.length} target aktif
            </span>
          </div>
          <SharkCat className="w-16 h-16 shrink-0" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 rounded-card bg-white p-6 shadow-kawaii border border-soft-gray">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <PawPrint className="w-5 h-5 text-[#C59B76]" />
              <h2 className="text-lg font-extrabold text-dark-brown">Ringkasan Keuangan</h2>
            </div>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-full bg-cream border border-soft-gray px-3.5 py-1.5 text-xs font-bold text-dark-brown"
            >
              <option value="daily">Harian</option>
              <option value="weekly">Mingguan</option>
              <option value="monthly">Bulanan</option>
              <option value="yearly">Tahunan</option>
            </select>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2EFED" />
                <XAxis dataKey="label" tick={{ fill: "#51443F", fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)} jt`} tick={{ fill: "#51443F", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => formatRupiah(value)} contentStyle={{ borderRadius: "16px", border: "none", backgroundColor: "#FFF9F4" }} />
                <Bar dataKey="income" name="Pemasukan" fill="#A5CFA8" radius={[10, 10, 0, 0]} maxBarSize={24} />
                <Bar dataKey="expense" name="Pengeluaran" fill="#F5A8B8" radius={[10, 10, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-6 rounded-card bg-white p-6 shadow-kawaii border border-soft-gray flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#E6B84C]" />
            <h2 className="text-lg font-extrabold text-dark-brown">Perkembangan Tabungan</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 my-4">
            <div className="sm:col-span-5 flex justify-center">
              <StrawberryCat className="w-40 h-40" />
            </div>
            <div className="sm:col-span-7 space-y-3">
              <div className="text-right">
                <span className="text-4xl font-black text-[#3B7A49]">
                  {savingsSummary.percentage}%
                </span>
              </div>
              <div className="w-full h-4 rounded-full bg-soft-gray overflow-hidden">
                <div className="h-full rounded-full bg-[#97C79B]" style={{ width: `${savingsSummary.percentage}%` }} />
              </div>
              <p className="text-sm font-extrabold text-dark-brown text-center">
                {formatRupiah(savingsSummary.collected)}{" "}
                <span className="text-dark-brown/50 font-semibold">
                  / {formatRupiah(savingsSummary.target)}
                </span>
              </p>
              <div className="flex justify-center">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cream border border-soft-gray text-xs font-bold text-dark-brown/80">
                  <Calendar className="w-3.5 h-3.5" />
                  Target Terdekat: {formatTanggalID(savingsSummary.nearestDeadline)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 rounded-card bg-white p-6 shadow-kawaii border border-soft-gray">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-dark-brown flex items-center gap-2">
              <Target className="w-5 h-5 text-[#D96B7E]" /> Target Tabungan Kamu
            </h2>
            <Link href="/tabungan" className="text-xs font-bold text-dark-brown/70 hover:text-dark-brown flex items-center gap-1">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {savingsGoals.slice(0, 3).map((goal) => {
              const rawPct = Math.round((goal.currentAmount / goal.targetAmount) * 100);
              return (
                <div key={goal.id} className="rounded-2xl bg-cream p-3.5 border border-soft-gray flex flex-col items-center text-center">
                  <p className="text-xs font-extrabold text-dark-brown line-clamp-1">{goal.name}</p>
                  <SharkCat className="w-16 h-16 my-1" />
                  <span className="text-base font-black text-dark-brown">{rawPct}%</span>
                  <div className="w-full h-2 rounded-full bg-soft-gray my-1.5 overflow-hidden">
                    <div className="h-full bg-[#97C79B] rounded-full" style={{ width: `${Math.min(rawPct, 100)}%` }} />
                  </div>
                  <p className="text-[11px] font-bold text-dark-brown/80">{formatRupiah(goal.currentAmount)}</p>
                  <p className="text-[10px] text-dark-brown/50">/ {formatRupiah(goal.targetAmount)}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-6 rounded-card bg-white p-6 shadow-kawaii border border-soft-gray">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-dark-brown flex items-center gap-2">
              <PawPrint className="w-5 h-5 text-[#C59B76]" /> Transaksi Terbaru
            </h2>
            <Link href="/transaksi" className="text-xs font-bold text-dark-brown/70 hover:text-dark-brown flex items-center gap-1">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center py-6 text-center">
              <SleepingCat className="w-24 h-24" />
              <p className="text-sm font-bold text-dark-brown/70 mt-2">Belum ada transaksi tercatat</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.slice(0, 5).map((trx) => {
                const isIncome = trx.type === "INCOME";
                return (
                  <div key={trx.id} className="flex items-center justify-between p-3 rounded-2xl bg-cream/70">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center ${isIncome ? "bg-[#DDEEDC] text-[#3B7A49]" : "bg-[#F8DDE3] text-[#B84A5E]"}`}>
                        {isIncome ? <ArrowUpCircle className="w-4 h-4" /> : <ArrowDownCircle className="w-4 h-4" />}
                      </span>
                      <div>
                        <p className="text-sm font-extrabold text-dark-brown">{trx.title}</p>
                        <p className="text-xs text-dark-brown/60">{trx.category?.name || "Transfer"} • {trx.account?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-extrabold ${isIncome ? "text-[#3B7A49]" : "text-[#B84A5E]"}`}>
                        {isIncome ? "+" : "-"} {formatRupiah(trx.amount)}
                      </p>
                      <p className="text-[11px] text-dark-brown/50">{formatTanggalID(trx.date)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}