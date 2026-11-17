import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function GET() {
  const user = await prisma.user.findFirst({
    select: { id: true, name: true, email: true },
  });
  const accounts = await prisma.account.findMany({ where: { userId: user?.id } });
  return NextResponse.json({ user, accounts });
}

export async function POST(request) {
  const body = await request.json();
  const user = await prisma.user.findFirst();

  if (body.action === "CLEAR_DEMO") {
    await prisma.$transaction([
      prisma.transaction.deleteMany({ where: { isDemo: true } }),
      prisma.savingsGoal.deleteMany({ where: { isDemo: true } }),
      prisma.asset.deleteMany({ where: { isDemo: true } }),
    ]);
    return NextResponse.json({ success: true });
  }

  const bal = Math.round(Number(body.initialBalance) || 0);
  const acc = await prisma.account.create({
    data: {
      userId: user.id,
      name: body.name,
      type: body.type,
      initialBalance: bal,
      currentBalance: bal,
    },
  });
  return NextResponse.json(acc, { status: 201 });
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    const updateData = {};
    if (body.name?.trim()) updateData.name = body.name.trim();
    if (body.email?.trim()) updateData.email = body.email.trim();

    if (body.newPassword) {
      if (body.newPassword.length < 6) {
        return NextResponse.json({ error: "Password baru minimal 6 karakter" }, { status: 400 });
      }
      const validOld = await bcrypt.compare(body.currentPassword || "", user.passwordHash);
      if (!validOld) {
        return NextResponse.json({ error: "Password lama salah" }, { status: 400 });
      }
      updateData.passwordHash = await bcrypt.hash(body.newPassword, 10);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  await prisma.account.delete({ where: { id: searchParams.get("id") } });
  return NextResponse.json({ success: true });
}