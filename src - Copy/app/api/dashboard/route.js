import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const user = await prisma.user.findFirst();
  if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

  const [accounts, transactions, savingsGoals, assets] = await Promise.all([
    prisma.account.findMany({ where: { userId: user.id } }),
    prisma.transaction.findMany({
      where: { userId: user.id },
      include: { category: true, account: true },
      orderBy: { date: "desc" },
    }),
    prisma.savingsGoal.findMany({ where: { userId: user.id } }),
    prisma.asset.findMany({ where: { userId: user.id } }),
  ]);

  const availableBalance = accounts.reduce((sum, a) => sum + a.currentBalance, 0);
  const totalSavings = savingsGoals.reduce((sum, s) => sum + s.currentAmount, 0);
  const totalAssets = assets.reduce((sum, a) => sum + a.currentValue, 0);
  const totalIncome = transactions.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);

  const totalTarget = savingsGoals.reduce((s, g) => s + g.targetAmount, 0);
  const pct = totalTarget > 0 ? Math.min(Math.round((totalSavings / totalTarget) * 100), 100) : 0;

  return NextResponse.json({
    userName: user.name,
    summary: {
      availableBalance,
      totalIncome,
      totalExpense,
      totalSavings,
      netWorth: availableBalance + totalSavings + totalAssets,
      incomeDeltaLabel: "+8% bulan ini",
      expenseDeltaLabel: "-5% bulan ini",
    },
    chartData: [
      { label: "Jan", income: 3500000, expense: 2600000 },
      { label: "Feb", income: 3300000, expense: 2000000 },
      { label: "Mar", income: 3800000, expense: 2100000 },
      { label: "Apr", income: 3000000, expense: 2050000 },
      { label: "Mei", income: totalIncome || 4000000, expense: totalExpense || 1500000 },
    ],
    savingsSummary: {
      collected: totalSavings,
      target: totalTarget,
      percentage: pct,
      nearestDeadline: savingsGoals[0]?.deadline || new Date(),
    },
    savingsGoals,
    recentTransactions: transactions.slice(0, 5),
  });
}