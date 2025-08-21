"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-center gap-10">
        {/* Decorative Circles */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#B39452]/20 rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#B39452]/20 rounded-full"></div>

        {/* Logo & Info */}
        <div className="flex-1 text-center md:text-left">
          <img src="/logo.png" alt="Luxeloom Logo" className="w-36 mx-auto md:mx-0 object-contain mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Panel</h1>
          <p className="text-gray-500 text-lg">
            Enter your credentials to manage Luxeloom products
          </p>
        <p className="text-red-500 text-lg">
          🚫 Access Restricted: This area is for admin users only.
          </p>
        </div>

        {/* Form */}
        <div className="flex-1 w-full">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#B39452] focus:border-[#B39452] outline-none text-gray-700 text-lg transition"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#B39452] focus:border-[#B39452] outline-none text-gray-700 text-lg transition"
              required
            />
            <button
              type="submit"
              className="w-full py-4 bg-[#B39452] text-white font-semibold rounded-2xl hover:bg-[#9d8147] transition-all shadow-md text-lg"
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-400 mt-6 text-sm">
            &copy; {new Date().getFullYear()} Luxeloom. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
