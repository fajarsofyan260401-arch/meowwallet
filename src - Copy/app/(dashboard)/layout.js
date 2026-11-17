"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ArrowLeftRight,
  PiggyBank,
  Briefcase,
  BarChart3,
  Settings,
  Plus,
} from "lucide-react";
import { SharkCat } from "@/components/cats/CatMascots";

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/transaksi", label: "Transaksi", icon: ArrowLeftRight },
  { href: "/tabungan", label: "Tabungan", icon: PiggyBank },
  { href: "/aset", label: "Aset", icon: Briefcase },
  { href: "/laporan", label: "Laporan", icon: BarChart3 },
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-cream text-dark-brown flex">
      {/* Sidebar Desktop & Tablet */}
      <aside className="hidden md:flex md:w-20 lg:w-64 flex-col justify-between bg-[#FFFDFB] border-r border-soft-gray p-4 sticky top-0 h-screen">
        <div>
          <div className="flex flex-col items-center lg:items-start gap-1 px-2 mb-6">
            <div className="flex items-center gap-2.5">
              <SharkCat className="w-11 h-11 shrink-0" />
              <div className="hidden lg:block">
                <span className="font-black text-xl tracking-tight text-dark-brown block leading-none">
                  MeowWallet
                </span>
                <span className="text-[11px] font-bold text-dark-brown/60">
                  Save • Plan • Grow ♡
                </span>
              </div>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-center lg:justify-start gap-3 px-3.5 py-3 rounded-2xl font-bold text-sm transition ${
                    active
                      ? "bg-pastel-blue text-dark-brown shadow-sm"
                      : "text-dark-brown/70 hover:bg-soft-gray/60 hover:text-dark-brown"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden lg:flex flex-col items-center text-center pt-4 border-t border-soft-gray/70">
          <SharkCat className="w-28 h-28" />
          <p className="text-xs font-extrabold text-dark-brown/70 mt-1">
            Keep saving, meow! ♡
          </p>
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-4 md:p-7 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Floating Action Button Tambah Transaksi */}
      <Link
        href="/transaksi?new=1"
        title="Tambah Transaksi Yuk!"
        className="fixed bottom-20 md:bottom-8 right-6 z-40 flex items-center gap-2 bg-soft-pink hover:bg-[#f4cdd6] text-dark-brown font-extrabold px-4 py-3 rounded-full shadow-kawaii border-2 border-white transition transform hover:scale-105"
      >
        <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#D96B7E]">
          <Plus className="w-5 h-5" />
        </span>
        <span className="hidden sm:inline text-sm">Tambah Transaksi</span>
      </Link>

      {/* Bottom Navigation Mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-soft-gray flex justify-around py-2 px-1">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold ${
                active ? "bg-pastel-blue text-dark-brown" : "text-dark-brown/60"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}