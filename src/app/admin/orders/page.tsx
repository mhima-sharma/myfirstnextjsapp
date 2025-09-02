// "use client";
// import { useEffect, useState } from "react";

// export default function AdminOrders() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await fetch("/api/orders/all-orders");
//         const data = await res.json();
//          console.log("API response:", data); 
//         setOrders(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         setOrders([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   if (loading) {
//     return <p className="text-center">Loading orders...</p>;
//   }

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">All Paid Orders</h1>
//       {orders.length === 0 ? (
//         <p>No orders found.</p>
//       ) : (
//         <table className="table-auto border-collapse border border-gray-300 w-full">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border px-4 py-2">Order ID</th>
//               <th className="border px-4 py-2">Customer Name</th>
//               <th className="border px-4 py-2">Customer Email</th>
//               <th className="border px-4 py-2">Customer Phone</th>
//               <th className="border px-4 py-2">Delivery Name</th>
//               <th className="border px-4 py-2">Delivery Phone</th>
//               <th className="border px-4 py-2">Delivery Address</th>
//               <th className="border px-4 py-2">City</th>
//               <th className="border px-4 py-2">Pincode</th>
//               <th className="border px-4 py-2">Product Name</th>
//               <th className="border px-4 py-2">Product Description</th>
//               <th className="border px-4 py-2">Price</th>
//               <th className="border px-4 py-2">Total</th>
//               <th className="border px-4 py-2">Payment Status</th>
//               <th className="border px-4 py-2">Order Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order: any) => (
//               <tr key={order.order_id}>
//                 <td className="border px-4 py-2">{order.order_id}</td>
//                 <td className="border px-4 py-2">{order.user_name}</td>
//                 <td className="border px-4 py-2">{order.user_email}</td>
//                 <td className="border px-4 py-2">{order.user_phone}</td>
//                 <td className="border px-4 py-2">{order.delivery_name}</td>
//                 <td className="border px-4 py-2">{order.delivery_phone}</td>
//                 <td className="border px-4 py-2">{order.delivery_address}</td>
//                 <td className="border px-4 py-2">{order.delivery_city}</td>
//                 <td className="border px-4 py-2">{order.delivery_pincode}</td>
//                 <td className="border px-4 py-2">{order.product_name}</td>
//                 <td className="border px-4 py-2">{order.product_description}</td>
//                 <td className="border px-4 py-2">₹{order.product_price}</td>
//                 <td className="border px-4 py-2">₹{order.total_amount}</td>
//                 <td className="border px-4 py-2">{order.payment_status}</td>
//                 <td className="border px-4 py-2">{new Date(order.order_date).toLocaleString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { FaArrowLeft, FaBoxOpen, FaUser, FaMapMarkerAlt, FaMoneyBillWave, FaPhone } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/all-orders");
        const data = await res.json();
        console.log("API response:", data);
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

  if (loading) {
    return <p className="text-center mt-10 text-gray-700">Loading orders...</p>;
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-8 text-gray-700 font-semibold px-4 py-2 bg-white/70 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
      >
        <FaArrowLeft /> Back
      </button>

      <h1 className="text-4xl font-extrabold mb-10 text-gray-900 text-center">
        Orders Dashboard
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-700">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.map((order: any) => (
            <div
              key={order.order_id}
              className="relative bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl shadow-2xl p-6 hover:translate-y-[-4px] hover:shadow-3xl transition-transform duration-300"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaBoxOpen className="text-green-500" /> Order #{order.order_id}
                </h2>
                <span
                  className={`px-4 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${
                    order.payment_status === "Paid"
                      ? "from-green-400 to-green-600 text-white"
                      : "from-yellow-400 to-yellow-600 text-white"
                  } shadow-md`}
                >
                  {order.payment_status}
                </span>
              </div>

              {/* Order Details */}
              <div className="space-y-2 text-gray-700">
                <p className="flex items-center gap-2">
                  <FaUser className="text-gray-500" /> <span className="font-semibold">Customer:</span> {order.user_name}
                </p>
                <p className="flex items-center gap-2">
                  <FaPhone className="text-gray-500" /> <span className="font-semibold">Customer Phone:</span> {order.user_phone}
                </p>
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-500" /> <span className="font-semibold">Address:</span> {order.delivery_address}, {order.delivery_city} - {order.delivery_pincode}
                </p>
                <p className="flex items-center gap-2">
                  <FaBoxOpen className="text-gray-500" /> <span className="font-semibold">Product:</span> {order.product_name}
                </p>
                <p className="flex items-center gap-2">
                  <FaBoxOpen className="text-gray-500" /> <span className="font-semibold">Quantity:</span> {order.quantity}
                </p>
                <p className="flex items-center gap-2">
                  <FaMoneyBillWave className="text-gray-500" /> <span className="font-semibold">Price per item:</span> ₹{order.product_price}
                </p>
                <p className="text-lg font-bold text-gray-800">
                  Total Amount: ₹{order.total_amount}
                </p>
                <p className="text-sm text-gray-500">
                  Order Date: {new Date(order.order_date).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
