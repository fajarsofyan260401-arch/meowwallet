import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { processSavingsTransfer } from "@/lib/financeEngine";

export async function GET() {
  const user = await prisma.user.findFirst();
  if (!user) return NextResponse.json({ goals: [], accounts: [] });

  const [goals, accounts] = await Promise.all([
    prisma.savingsGoal.findMany({
      where: { userId: user.id },
      include: {
        transactions: {
          include: { account: true },
          orderBy: { date: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.account.findMany({ where: { userId: user.id } }),
  ]);

  return NextResponse.json({ goals, accounts });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const user = await prisma.user.findFirst();

    if (body.action === "TRANSFER") {
      const res = await processSavingsTransfer(body);
      return NextResponse.json(res);
    }

    const goal = await prisma.savingsGoal.create({
      data: {
        userId: user.id,
        name: body.name,
        targetAmount: Math.round(Number(body.targetAmount)),
        deadline: body.deadline ? new Date(body.deadline) : null,
        note: body.note || "",
      },
    });
    return NextResponse.json(goal, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await prisma.savingsGoal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}