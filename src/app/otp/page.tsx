"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OtpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ emailOrPhone: "", otp: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      document.cookie = `token=${data.token}; path=/`;
      router.push("/dashboard");
    } else {
      setMessage(data.error || "OTP verification failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">OTP Verification</h1>
      {message && <p className="text-red-500 mb-2">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="emailOrPhone" placeholder="Email or Phone" value={form.emailOrPhone} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="otp" placeholder="OTP" value={form.otp} onChange={handleChange} className="w-full p-2 border rounded" required />
        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-2 rounded">
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
}
