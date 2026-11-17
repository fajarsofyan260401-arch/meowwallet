"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SharkCat } from "@/components/cats/CatMascots";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="w-full max-w-md rounded-card bg-white p-8 shadow-kawaii border-2 border-pastel-blue space-y-5 text-center">
        <div className="flex flex-col items-center">
          <SharkCat className="w-28 h-28" />
          <h1 className="text-2xl font-black text-dark-brown mt-2">MeowWallet</h1>
          <p className="text-xs font-bold text-dark-brown/60">Save • Plan • Grow ♡</p>
        </div>

        {error && <p className="text-xs font-bold text-[#B84A5E] bg-soft-pink/60 py-2 rounded-xl">{error}</p>}

        <div className="space-y-3 text-left">
          <div>
            <label className="text-xs font-extrabold text-dark-brown/75">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-2xl bg-cream border border-soft-gray text-sm font-semibold"
            />
          </div>
          <div>
            <label className="text-xs font-extrabold text-dark-brown/75">Kata Sandi</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-2xl bg-cream border border-soft-gray text-sm font-semibold"
            />
          </div>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full py-3 rounded-2xl bg-dark-brown text-white font-extrabold text-sm hover:opacity-90 transition"
        >
          {loading ? "Memeriksa..." : "Masuk ke MeowWallet"}
        </button>
      </form>
    </div>
  );
}