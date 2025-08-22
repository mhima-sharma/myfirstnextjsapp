"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMessage("OTP verified successfully! Redirecting...");
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setMessage(data.error || "OTP verification failed");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Luxeloom Logo */}
      <div className="mb-6">
        <Image
          src="/logo.png" // ✅ Replace with your logo path
          alt="Luxeloom Logo"
          width={150}
          height={60}
          className="mx-auto"
        />
      </div>

      {/* OTP Card */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl shadow-lg rounded-2xl p-8 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-2">
          OTP Verification
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Please enter the OTP sent to your email or phone.
        </p>

        {/* Success / Error Message */}
        {message && (
          <p
            className={`text-center mb-4 text-sm font-medium ${
              message.includes("successfully") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              name="emailOrPhone"
              placeholder="Enter Email or Phone"
              value={form.emailOrPhone}
              onChange={handleChange}
              className="w-full p-3 text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              required
            />
          </div>

          <div>
            <input
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              className="w-full p-3 text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-semibold p-3 rounded-xl shadow-md hover:bg-gray-800 transition duration-300"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-6 text-gray-500 text-sm">
          Didn’t receive the OTP?{" "}
          <span className="text-black font-semibold cursor-pointer hover:underline">
            Resend
          </span>
        </p>
      </div>
    </div>
  );
}
