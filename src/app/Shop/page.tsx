"use client";

import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import NavBar from "../navbar/page";
import Footer from "../footer/page";
import Link from "next/link";

export default function Shop() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch categories & products
  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/products/get"),
        ]);

        const catData = await catRes.json();
        const prodData = await prodRes.json();

        if (catData.success) {
          setCategories(["All", ...catData.categories.map((c: any) => c.name)]);
        }
        if (prodData.success) {
          setProducts(prodData.products);
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // ✅ Filter products by category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-500 animate-pulse">
          Loading products...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 shadow-md bg-black">
        <NavBar />
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-28 pb-10 px-6 md:px-16">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-black via-gray-900 to-gray-800 rounded-xl shadow-lg p-10 mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gold">LuxeLoom Shop</h1>
          <p className="mt-3 text-lg text-gray-300 max-w-xl">
            Discover our exclusive collection of premium outfits, accessories,
            gifts, plants, and candles. Experience shopping like never before.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-4 mb-10 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gold text-white shadow-lg scale-105 border-2 border-gold"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <p className="text-center col-span-full text-gray-500 text-lg">
              No products available.
            </p>
          ) : (
            filteredProducts.map((product) => {
              // ✅ Apply static 30% discount
              const discountPercentage = 30;
              const discountPrice = Math.round(
                product.price - (product.price * discountPercentage) / 100
              );

              return (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:scale-105 transition relative"
                >
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={product.images?.split(",")[0] || "/placeholder.png"}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    {/* Discount Badge */}
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
                      {discountPercentage}% OFF
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {product.name}
                    </h3>

                    {/* Price Section */}
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-lg font-bold text-green-600">₹{discountPrice}</p>
                      <p className="text-sm line-through text-gray-500">₹{product.price}</p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mt-2">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          className={`${
                            index < Math.round(4.5)
                              ? "text-gold"
                              : "text-gray-400"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-gray-500 text-sm">4.5</span>
                    </div>

                    {/* View Details Button */}
                    <Link href={`/product-detail?productId=${product.id}`}>
                      <button className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Footer */}
      <div className="bg-black text-gray-300 pt-12 pb-6 px-6 md:px-16">
        <Footer />
      </div>
    </div>
  );
}
