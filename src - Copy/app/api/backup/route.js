import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "prisma", "meowwallet.db");

export async function GET() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return NextResponse.json({ error: "Database tidak ditemukan" }, { status: 404 });
    }
    const fileBuffer = fs.readFileSync(DB_PATH);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/x-sqlite3",
        "Content-Disposition": 'attachment; filename="meowwallet-backup.db"',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file) return NextResponse.json({ error: "File backup belum dipilih" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validasi header SQLite ("SQLite format 3")
    const header = buffer.subarray(0, 15).toString("utf8");
    if (!header.startsWith("SQLite format 3")) {
      return NextResponse.json({ error: "File bukan database SQLite yang valid" }, { status: 400 });
    }

    fs.writeFileSync(DB_PATH, buffer);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}