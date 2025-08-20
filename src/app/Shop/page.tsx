"use client";

import { useState } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaStar, FaTwitter } from "react-icons/fa";
import NavBar from "../navbar/page";
import Footer from "../footer/page";

export default function Shop() {
  const categories = ["All", "Outfits", "Accessories", "Gifts", "Plants", "Candles"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const products = [
    {
      id: 1,
      name: "Elegant Beige Coat",
      category: "Outfits",
      price: "₹3,499",
      image: "/outfits.png",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Premium Leather Handbag",
      category: "Accessories",
      price: "₹2,999",
      image: "/accessories.png",
      rating: 4.7,
    },
    {
      id: 3,
      name: "Luxury Scented Candle",
      category: "Candles",
      price: "₹899",
      image: "/candles.png",
      rating: 4.9,
    },
    {
      id: 4,
      name: "Indoor Tropical Plant",
      category: "Plants",
      price: "₹1,299",
      image: "/plants.png",
      rating: 4.6,
    },
    {
      id: 5,
      name: "Exclusive Gift Box Set",
      category: "Gifts",
      price: "₹1,799",
      image: "/gifts.png",
      rating: 4.8,
    },
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
      {/* Header / NavBar */}
      <header className="fixed top-0 left-0 w-full z-50 shadow-md bg-black">
        <NavBar />
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-26 pb-5 px-6 md:px-16">
        {/* Hero Banner */}
        <div className="relative bg-gradient-to-r from-black via-gray-900 to-gray-800 rounded-xl shadow-lg p-10 mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gold">LuxeLoom Shop</h1>
          <p className="mt-3 text-lg text-gray-300 max-w-xl">
            Discover our exclusive collection of premium outfits, accessories, gifts,
            plants, and candles. Experience shopping like never before.
          </p>
          <button className="mt-5 bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-darkGold transition">
            Explore Now
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-10 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full font-medium transition ${
                selectedCategory === category
                  ? "bg-gold text-black shadow-lg"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-700  hover:bg-gray-300  dark:hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:scale-105 transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {product.name}
                </h3>
                <p className="text-gold font-bold mt-1">{product.price}</p>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={`${
                        index < Math.round(product.rating)
                          ? "text-gold"
                          : "text-gray-400"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-500 text-sm">{product.rating}</span>
                </div>
                <button className="mt-4 w-full bg-gold text-black py-2 rounded-lg hover:bg-darkGold transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-black mt-16 rounded-xl shadow-lg p-10 text-center border border-gold">
          <h2 className="text-2xl md:text-3xl font-bold text-gold">
            Elevate Your Lifestyle with LuxeLoom
          </h2>
          <p className="mt-3 text-gray-300">
            Shop our curated collections and bring home luxury at your fingertips.
          </p>
          <button className="mt-5 bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-darkGold transition">
            Start Shopping
          </button>
        </div>
      </main>

      {/* Footer */}
      
      <div className="bg-black text-gray-300 pt-12 pb-6 px-6 md:px-16">
        <Footer />
      </div>
   
    </div>
    );
}
