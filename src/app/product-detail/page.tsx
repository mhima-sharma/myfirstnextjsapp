"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import NavBar from "../navbar/page";
import Footer from "../footer/page";
import Image from "next/image";
import { useSession } from "next-auth/react"; // ✅ Import useSession

export default function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState(0);
  const router = useRouter();
  const { data: session } = useSession(); // ✅ Get session
  const isLoggedIn = !!session;

  // Static product data (dummy)
  const product = {
    id: 1,
    name: "Elegant Cotton Kurta Set",
    price: 2499,
    rating: 4.5,
    category: "Women's Outfits",
    description:
      "This elegant cotton kurta set is crafted with premium fabric for ultimate comfort and style. Perfect for casual outings, office wear, or festive occasions.",
    images: [
      "/images/product1-1.jpg",
      "/images/product1-2.jpg",
      "/images/product1-3.jpg",
    ],
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert("Please login first to add items to your cart!");
    } else {
      alert(`✅ ${product.name} added to cart!`);
      // TODO: call your API to actually add to cart
    }
  };

  // Handle Buy Now
  const handleBuyNow = () => {
    if (!isLoggedIn) {
      alert("Please login first to purchase items!"); 
    } else {
      alert(`🛒 Redirecting to checkout for ${product.name}`);
      router.push(`/checkout?productId=${product.id}`);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <NavBar />

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
        {/* Left: Product Images */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md h-96 relative">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover rounded-xl shadow-md"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-3 mt-4">
            {product.images.map((img, index) => (
              <div
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? "border-black" : "border-gray-300"
                }`}
              >
                <Image src={img} alt={`Thumbnail ${index}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col justify-start">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center mt-2">
            {Array.from({ length: 5 }, (_, i) => (
              <FaStar
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-gray-600 text-sm">{product.rating} / 5</span>
          </div>

          {/* Price */}
          <p className="text-2xl font-semibold text-green-600 mt-4">₹{product.price}</p>

          {/* Category */}
          <p className="mt-2 text-sm text-gray-500">
            Category: <span className="font-medium text-gray-800">{product.category}</span>
          </p>

          {/* Description */}
          <p className="mt-6 text-gray-700 leading-relaxed">{product.description}</p>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="bg-black text-white px-6 py-3 rounded-lg shadow hover:bg-gray-800 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
