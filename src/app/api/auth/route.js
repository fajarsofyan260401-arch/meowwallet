import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import prisma from "@/lib/prisma";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "meowwallet-secret-key-2026");

export async function POST(request) {
  try {
    const { action, email, password } = await request.json();

    if (action === "LOGOUT") {
      const res = NextResponse.json({ success: true });
      res.cookies.delete("meow_session");
      return res;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "Email tidak terdaftar" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Kata sandi salah" }, { status: 401 });

    const token = await new SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(SECRET);

    const response = NextResponse.json({ success: true, user: { name: user.name, email: user.email } });
    response.cookies.set("meow_session", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}