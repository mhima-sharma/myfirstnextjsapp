// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import { FcGoogle } from "react-icons/fc";

// export default function LoginPage() {
//   const router = useRouter();
//   const [step, setStep] = useState<1 | 2>(1);
//   const [form, setForm] = useState({ emailOrPhone: "", otp: "" });
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // ✅ Step 1: Send OTP
//   const handleSendOtp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ emailOrPhone: form.emailOrPhone }),
//       });

//       const data = await res.json();
//       setLoading(false);

//       if (res.ok) {
//         setStep(2); // ✅ Move to OTP verification step
//       } else {
//         setMessage(data.error || "Failed to send OTP");
//       }
//     } catch (error) {
//       console.error("Error sending OTP:", error);
//       setMessage("Something went wrong. Please try again.");
//       setLoading(false);
//     }
//   };

//   // ✅ Step 2: Verify OTP & Store Token
//   const handleVerifyOtp = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await fetch("/api/auth/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();
//       setLoading(false);

//       if (res.ok) {
//         // ✅ Store token in localStorage
//         localStorage.setItem("token", data.token);

//         setMessage("OTP verified successfully! Redirecting...");
        
//         // ✅ Redirect after short delay
//         setTimeout(() => {
//           router.push("/dashboard");
//         }, 1000);
//       } else {
//         setMessage(data.error || "OTP verification failed");
//       }
//     } catch (error) {
//       console.error("Error verifying OTP:", error);
//       setMessage("Something went wrong. Please try again.");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 relative">
//         {/* Logo */}
//         <div className="flex justify-center mb-4">
//           <Image src="/logo.png" alt="Logo" width={120} height={80} />
//         </div>

//         {/* Heading */}
//         <h1 className="text-2xl font-bold text-center text-gray-900">
//           Sign in to LuxeLoom
//         </h1>
//         <p className="text-center text-gray-500 text-sm mt-1 mb-6">
//           {step === 1
//             ? "Enter your email or phone number to receive an OTP"
//             : "Enter the OTP sent to your email or phone"}
//         </p>

//         {/* Error / Success Message */}
//         {message && (
//           <p
//             className={`text-center mb-4 text-sm ${
//               message.includes("successfully") ? "text-green-600" : "text-red-500"
//             }`}
//           >
//             {message}
//           </p>
//         )}

//         {/* Step 1: Email or Phone */}
//         {step === 1 && (
//           <form onSubmit={handleSendOtp} className="space-y-4">
//             <input
//               name="emailOrPhone"
//               placeholder="Email or Phone"
//               value={form.emailOrPhone}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-[#B39452] focus:border-[#B39452] outline-none transition text-gray-600"
//               required
//             />
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-[#B39452] text-white font-semibold py-3 rounded-lg hover:bg-[#9d8147] transition disabled:bg-gray-400"
//             >
//               {loading ? "Sending OTP..." : "PROCEED"}
//             </button>
//           </form>
//         )}

//         {/* Step 2: OTP Verification */}
//         {step === 2 && (
//           <form onSubmit={handleVerifyOtp} className="space-y-4">
//             <input
//               name="otp"
//               placeholder="Enter OTP"
//               value={form.otp}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 text-gray-600 focus:ring-[#B39452] focus:border-[#B39452] outline-none transition"
//               required
//             />
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-[#B39452] text-white font-semibold py-3 rounded-lg hover:bg-[#9d8147] transition disabled:bg-gray-400"
//             >
//               {loading ? "Verifying OTP..." : "VERIFY OTP"}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({ emailOrPhone: "", otp: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ If user is already logged in, redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: form.emailOrPhone }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setStep(2); // ✅ Move to OTP verification step
      } else {
        setMessage(data.error || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // ✅ Step 2: Verify OTP & Refresh Page
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        // ✅ Store token in localStorage
        localStorage.setItem("token", data.token);

        setMessage("OTP verified successfully! Reloading...");

        // ✅ Refresh the page after short delay
        setTimeout(() => {
          window.location.reload();
        }, 800);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 relative">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image src="/logo.png" alt="Logo" width={120} height={80} />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Sign in to LuxeLoom
        </h1>
        <p className="text-center text-gray-500 text-sm mt-1 mb-6">
          {step === 1
            ? "Enter your email or phone number to receive an OTP"
            : "Enter the OTP sent to your email or phone"}
        </p>

        {/* Error / Success Message */}
        {message && (
          <p
            className={`text-center mb-4 text-sm ${
              message.includes("successfully") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        {/* Step 1: Email or Phone */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <input
              name="emailOrPhone"
              placeholder="Email or Phone"
              value={form.emailOrPhone}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-[#B39452] focus:border-[#B39452] outline-none transition text-gray-600"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#B39452] text-white font-semibold py-3 rounded-lg hover:bg-[#9d8147] transition disabled:bg-gray-400"
            >
              {loading ? "Sending OTP..." : "PROCEED"}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 text-gray-600 focus:ring-[#B39452] focus:border-[#B39452] outline-none transition"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#B39452] text-white font-semibold py-3 rounded-lg hover:bg-[#9d8147] transition disabled:bg-gray-400"
            >
              {loading ? "Verifying OTP..." : "VERIFY OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
