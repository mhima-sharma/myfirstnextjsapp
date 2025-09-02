"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

export default function PaymentFailed() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/checkout"); // ✅ Redirect back to checkout after 3s
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <XCircle className="text-red-500 w-20 h-20 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800">Payment Failed ❌</h1>
      <p className="text-gray-600 mt-2">Redirecting you back to checkout...</p>
      <div className="mt-6">
        <button
          onClick={() => router.push("/checkout")}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
