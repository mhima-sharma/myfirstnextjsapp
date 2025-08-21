"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      router.push("/otp");
    } else {
      setMessage(data.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image src="/logo.png" alt="Logo" width={120} height={80} />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900">Create Account</h1>
        <p className="text-center text-gray-500 text-sm mt-1 mb-6">
          Sign up to continue shopping with LuxeLoom
        </p>

        {message && <p className="text-red-500 text-center mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-[#B39452] focus:border-[#B39452] outline-none transition text-gray-600"
            required
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-[#B39452] focus:border-[#B39452] outline-none transition text-gray-600"
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-[#B39452] focus:border-[#B39452] outline-none transition text-gray-600"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-[#B39452] focus:border-[#B39452] outline-none transition text-gray-600"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B39452] text-white font-semibold py-3 rounded-lg hover:bg-[#9d8147] transition disabled:bg-gray-400"
          >
            {loading ? "Signing up..." : "SIGN UP"}
          </button>
        </form>

       
      </div>
    </div>
  );
}
