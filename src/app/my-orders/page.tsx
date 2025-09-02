"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // ✅ Check if user is logged in
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      window.location.href = "/login";
      return;
    }
    setToken(storedToken);
  }, []);

  // ✅ Fetch user's orders
  useEffect(() => {
    if (!token) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/orders/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  // ✅ Handle Review Button Click
  const handleReview = (orderId: string) => {
    router.push(`/reviews`);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
        <Link
          href="/"
          className="px-5 py-2 bg-[#B39452] text-white rounded-xl hover:bg-[#9d8147] transition"
        >
          Back to Home
        </Link>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-4 border-[#B39452] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : orders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border p-5 rounded-2xl shadow-md bg-white hover:shadow-lg transition duration-300"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  Order #{order.id}
                </h2>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Order Details */}
              <div className="space-y-2">
                <p className="text-gray-700 font-medium">
                  Total Amount: <span className="font-bold">₹{order.total}</span>
                </p>
                <p className="text-gray-500 text-sm">
                  Ordered on:{" "}
                  <span className="font-medium">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </p>
              </div>

              {/* Give Review Button */}
              <div className="mt-4">
                <button
                  onClick={() => handleReview(order.id)}
                  className="w-full px-4 py-2 bg-[#B39452] text-white rounded-lg hover:bg-[#9d8147] transition"
                >
                  Give Review
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center text-lg">
          You haven't placed any orders yet.
        </p>
      )}
    </div>
  );
}
