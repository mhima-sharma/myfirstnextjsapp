
"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

 // Derived stats
const totalOrders = orders.length;
const totalPaidOrders = orders.length;

const totalRevenue = orders.reduce((sum, o) => {
  const value = Number(o.total) || 0; // if o.total is undefined/null, use 0
  console.log(value, "value",sum , o)
  return sum + value;
}, 0);

console.log(totalOrders, "abc", totalPaidOrders, totalRevenue);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/all-orders");
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">
        Orders Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="flex flex-wrap justify-center gap-6 mb-6 z-10">
        <div className="bg-white shadow-md rounded-2xl px-8 py-6 text-center w-64">
          <h2 className="text-xl font-semibold text-gray-700">Total Orders</h2>
          <p className="text-4xl font-bold text-[#B39452] mt-2">{totalOrders}</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl px-8 py-6 text-center w-64">
          <h2 className="text-xl font-semibold text-gray-700">Payments Success</h2>
          <p className="text-4xl font-bold text-green-600 mt-2">{totalPaidOrders}</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl px-8 py-6 text-center w-64">
          <h2 className="text-xl font-semibold text-gray-700">Total Revenue</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">₹{totalRevenue}</p>
        </div>
      </div>

      {/* Scrollable Orders Table */}
      <div className="bg-white shadow rounded-2xl p-4 flex-1 flex flex-col">
        {loading ? (
          <p className="text-center text-gray-700">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-700">No orders found.</p>
        ) : (
          <div className="overflow-x-auto w-full flex-1">
            <div className="min-w-max overflow-y-auto h-[calc(100vh-300px)]">
              <table className="w-full border border-gray-200 text-gray-800">
                <thead className="sticky top-0 bg-[#B39452]/10 z-10">
                  <tr>
                    {[
                      "Order ID",
                      "Customer",
                      "Email",
                      "Phone",
                      "Address",
                      "City",
                      "Pincode",
                      "Total",
                      "Payment",
                      "Date",
                    ].map((head) => (
                      <th
                        key={head}
                        className="border px-4 py-2 text-left bg-[#B39452]/10"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => (
                    <tr
                      key={order.order_id}
                      className="border-b hover:bg-[#B39452]/5 transition"
                    >
                      <td className="border px-4 py-2">{order.order_id}</td>
                      <td className="border px-4 py-2">{order.user_name}</td>
                      <td className="border px-4 py-2">{order.user_email}</td>
                      <td className="border px-4 py-2">{order.user_phone}</td>
                      <td className="border px-4 py-2">{order.delivery_address}</td>
                      <td className="border px-4 py-2">{order.delivery_city}</td>
                      <td className="border px-4 py-2">{order.delivery_pincode}</td>
                      <td className="border px-4 py-2">₹{order.total_amount}</td>
                      <td className="border px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-medium ${
                            order.payment_status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="border px-4 py-2">
                        {new Date(order.order_date).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
