"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess() {
  const router = useRouter();

  // Clear cart after payment
  const clearCartAfterPayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/cart/clear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        console.log("✅ Cart cleared after payment");
      }
    } catch (err) {
      console.error("❌ Error clearing cart after payment:", err);
    }
  };

  useEffect(() => {
    clearCartAfterPayment(); // Clear cart on page load

    const timer = setTimeout(() => {
      router.push("/dashboard"); // Redirect after 3s
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <CheckCircle className="text-green-500 w-20 h-20 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800">Payment Successful 🎉</h1>
      <p className="text-gray-600 mt-2">
        Redirecting you to your dashboard...
      </p>
      <div className="mt-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-2 bg-[#B39452] text-white rounded-lg hover:bg-[#9d8147]"
        >
          Go to Dashboard Now
        </button>
      </div>
    </div>
  );
}
