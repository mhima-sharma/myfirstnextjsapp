"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products/get");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg animate-pulse">Loading products...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            LuxeLoom Admin Panel
          </h1>
          
          <button className="bg-black text-white px-5 py-2 rounded-xl shadow-md hover:bg-gray-800 transition">
            + Add Product
          </button>
        </div>

        {/* Product Table */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm tracking-wide">
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No products found 😢
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-gray-50 transition duration-300"
                  >
                    {/* Product Image */}
                    <td className="p-4">
                      <img
                        src={product.images?.split(",")[0]}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover shadow-sm"
                      />
                    </td>

                    {/* Product Name */}
                    <td className="p-4 font-medium text-gray-800">
                      {product.name}
                    </td>

                    {/* Category */}
                    <td className="p-4 text-gray-600">
                      {product.category || "N/A"}
                    </td>

                    {/* Price */}
                    <td className="p-4 font-semibold text-green-600">
                      ₹{product.price}
                    </td>

                    {/* Actions */}
                    <td className="p-4 space-x-3">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
                        Edit
                      </button>
                      <button className="px-3 py-1 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
