import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    const [transactions, accounts, savings, assets] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId: user.id },
        include: { category: true, account: true, destinationAccount: true },
        orderBy: { date: "desc" },
      }),
      prisma.account.findMany({ where: { userId: user.id } }),
      prisma.savingsGoal.findMany({ where: { userId: user.id } }),
      prisma.asset.findMany({ where: { userId: user.id } }),
    ]);

    const wb = XLSX.utils.book_new();

    // Sheet 1: Transaksi
    const trxRows = transactions.map((t) => ({
      Tanggal: new Date(t.date).toLocaleDateString("id-ID"),
      Judul: t.title,
      Jenis: t.type,
      Kategori: t.category?.name || "Transfer",
      Rekening: t.type === "TRANSFER"
        ? `${t.account?.name} -> ${t.destinationAccount?.name}`
        : t.account?.name || "-",
      Nominal_IDR: t.amount,
      Catatan: t.note || "",
    }));
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(trxRows.length ? trxRows : [{ Info: "Belum ada transaksi" }]),
      "Transaksi"
    );

    // Sheet 2: Rekening
    const accRows = accounts.map((a) => ({
      Nama_Rekening: a.name,
      Tipe: a.type,
      Saldo_Awal_IDR: a.initialBalance,
      Saldo_Saat_Ini_IDR: a.currentBalance,
    }));
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(accRows.length ? accRows : [{ Info: "Belum ada rekening" }]),
      "Rekening"
    );

    // Sheet 3: Target Tabungan
    const savRows = savings.map((s) => ({
      Nama_Target: s.name,
      Terkumpul_IDR: s.currentAmount,
      Target_IDR: s.targetAmount,
      Persentase: `${Math.round((s.currentAmount / (s.targetAmount || 1)) * 100)}%`,
      Tenggat: s.deadline ? new Date(s.deadline).toLocaleDateString("id-ID") : "-",
    }));
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(savRows.length ? savRows : [{ Info: "Belum ada tabungan" }]),
      "Tabungan"
    );

    // Sheet 4: Aset & Investasi
    const assetRows = assets.map((a) => ({
      Nama_Aset: a.name,
      Kategori: a.category,
      Jumlah_Unit: a.quantity,
      Nilai_Saat_Ini_IDR: a.currentValue,
    }));
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(assetRows.length ? assetRows : [{ Info: "Belum ada aset" }]),
      "Aset"
    );

    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="Laporan-MeowWallet.xlsx"',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}