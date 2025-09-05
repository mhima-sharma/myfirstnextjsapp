"use client";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowLeft } from "lucide-react";

export default function PremiumPage() {
  const router = useRouter();

  const handleJoinNow = () => {
    // 🔹 Later integrate Razorpay / Stripe
    // router.push("/checkout?plan=lifetime");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black flex flex-col items-center px-4 py-12 relative">
      
      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="absolute top-6 left-6 flex items-center gap-2 bg-gray-900/70 hover:bg-gray-800 text-gray-200 px-4 py-2 rounded-lg text-sm shadow-md backdrop-blur-md transition-all duration-300"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Premium Header */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-lg mb-3">
        Luxeloom Elite Premium
      </h1>
      <p className="text-gray-400 text-lg md:text-xl max-w-2xl text-center mb-10">
        Step into the world of **luxury shopping**. Lifetime access. Zero limits.
      </p>

      {/* Premium Card */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-yellow-400 rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center relative overflow-hidden">

        {/* Luxe Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-300/5 to-transparent rounded-3xl pointer-events-none"></div>

        {/* Plan Title */}
        <h2 className="text-3xl font-bold text-yellow-400 tracking-wide">
          Lifetime LuxePass
        </h2>
        <p className="text-gray-400 mt-2 mb-4 italic">
          One payment • Forever benefits
        </p>

        {/* Price */}
        <div className="text-6xl font-extrabold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent mb-4">
          ₹7,999
        </div>
        <p className="text-sm text-gray-400 mb-6">
          No monthly fees • No renewals • Lifetime premium
        </p>

        {/* Features */}
        <div className="text-left space-y-4 mb-8">
          {[
            "AI-powered personal stylist",
            "Virtual try-on for outfits",
            "Free same-day delivery",
            "Exclusive members-only products",
            "Invite-only online fashion shows",
            "Zero delivery charges forever",
            "Luxury gift packaging on every order",
            "Surprise birthday & anniversary gifts",
            "VIP Luxe Club access",
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <CheckCircle2 className="text-yellow-400 w-5 h-5 drop-shadow-md" />
              <span className="text-gray-300">{feature}</span>
            </div>
          ))}
        </div>

        {/* Join Button */}
        <button
          onClick={handleJoinNow}
          className="w-full bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-black font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 text-lg tracking-wide"
        >
          Unlock Lifetime Premium
        </button>

        {/* Limited Offer */}
        <p className="text-yellow-400 text-sm mt-5 italic">
          🎁 Limited slots available — Become a Luxe Member today!
        </p>
      </div>

      {/* Footer */}
      <p className="text-gray-500 text-sm mt-8 italic">
        One-time payment. No hidden charges. No expiry. Pure luxury.
      </p>
    </div>
  );
}
