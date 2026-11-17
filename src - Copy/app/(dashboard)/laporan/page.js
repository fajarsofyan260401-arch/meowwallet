"use client";

import React, { useEffect, useState } from "react";
import { FileSpreadsheet, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SharkCat } from "@/components/cats/CatMascots";
import { formatRupiah, formatTanggalID } from "@/lib/formatters";

export default function LaporanPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("/api/transactions")
      .then((r) => r.json())
      .then((d) => setTransactions(d.transactions || []));
  }, []);

  const income = transactions.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);

  function exportPDF() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Laporan Keuangan MeowWallet", 14, 18);
    doc.setFontSize(10);
    doc.text(`Total Pemasukan: ${formatRupiah(income)} | Total Pengeluaran: ${formatRupiah(expense)}`, 14, 26);

    autoTable(doc, {
      startY: 32,
      head: [["Tanggal", "Judul", "Jenis", "Kategori", "Rekening", "Nominal"]],
      body: transactions.map((t) => [
        formatTanggalID(t.date),
        t.title,
        t.type,
        t.category?.name || "Transfer",
        t.account?.name || "-",
        formatRupiah(t.amount),
      ]),
    });
    doc.save("Laporan-MeowWallet.pdf");
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="rounded-card bg-mint-green/70 p-6 shadow-kawaii border border-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-dark-brown">Laporan Keuangan</h1>
          <p className="text-sm text-dark-brown/75">Unduh laporan aktual ke Excel (.xlsx) atau PDF</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/api/export?format=xlsx" className="bg-white text-dark-brown font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-sm flex items-center gap-2 hover:bg-cream">
            <FileSpreadsheet className="w-4 h-4 text-[#3B7A49]" /> Ekspor Excel
          </a>
          <button onClick={exportPDF} className="bg-dark-brown text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2">
            <FileText className="w-4 h-4" /> Ekspor PDF
          </button>
          <SharkCat className="w-16 h-16 hidden sm:block" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-card bg-white p-5 shadow-kawaii">
          <p className="text-xs font-bold text-dark-brown/60">Total Pemasukan</p>
          <p className="text-xl font-black text-[#3B7A49] mt-1">{formatRupiah(income)}</p>
        </div>
        <div className="rounded-card bg-white p-5 shadow-kawaii">
          <p className="text-xs font-bold text-dark-brown/60">Total Pengeluaran</p>
          <p className="text-xl font-black text-[#B84A5E] mt-1">{formatRupiah(expense)}</p>
        </div>
        <div className="rounded-card bg-white p-5 shadow-kawaii">
          <p className="text-xs font-bold text-dark-brown/60">Selisih Bersih</p>
          <p className="text-xl font-black text-dark-brown mt-1">{formatRupiah(income - expense)}</p>
        </div>
      </div>

      <div className="rounded-card bg-white p-5 shadow-kawaii overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-soft-gray text-xs text-dark-brown/60">
              <th className="py-2.5">Tanggal</th>
              <th>Judul</th>
              <th>Kategori</th>
              <th>Rekening</th>
              <th className="text-right">Nominal</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-soft-gray/50">
                <td className="py-3 text-xs">{formatTanggalID(t.date)}</td>
                <td className="font-bold">{t.title}</td>
                <td>{t.category?.name || "Transfer"}</td>
                <td>{t.account?.name}</td>
                <td className="text-right font-extrabold">{formatRupiah(t.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}