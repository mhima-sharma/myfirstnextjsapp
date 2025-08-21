"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
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
      <div className="flex justify-center items-center min-h-[70vh]">
        <p className="text-gray-500 text-lg animate-pulse">Loading products...</p>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 tracking-wide mb-10">
          Explore Our <span className="text-amber-600">Exclusive Collection</span>
        </h1>

        {/* Products Grid */}
        {products.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No products available right now.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product: any) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Product Image */}
                <div className="relative w-full h-64 overflow-hidden">
                  <img
                    src={product.images?.split(",")[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-amber-600 text-white px-3 py-1 rounded-full text-xs uppercase font-semibold tracking-wide shadow-md">
                    Luxe
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-5">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 truncate">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-amber-600 font-semibold text-lg">
                      ₹{product.price}
                    </span>
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-full shadow hover:bg-gray-800 transition">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
