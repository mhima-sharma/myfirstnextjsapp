"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaStar } from "react-icons/fa";
import NavBar from "../navbar/page";
import Footer from "../footer/page";
import Image from "next/image";

export default function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId"); // get from URL query

  const [storeToken, setStoreToken] = useState<string | null>(null);

  // ✅ Get token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setStoreToken(token);
  }, []);

  const isLoggedIn = !!storeToken;

  useEffect(() => {
    if (!productId) return;

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();

        if (data.success) {
          const images = Array.isArray(data.product.images)
            ? data.product.images
            : data.product.images
            ? data.product.images.split(",")
            : [];

          setProduct({ ...data.product, images });
        } else {
          alert("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Error fetching product");
      }
    }

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert("Please login first to add items to your cart!");
    } else if (product) {
      alert(`✅ ${product.name} added to cart!`);
      // TODO: Add API to save cart
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      alert("Please login first to purchase items!");
    } else if (product) {
      router.push(`/checkout?productId=${product.id}`);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <NavBar />
        <p className="text-center mt-20 text-lg">Loading product...</p>
        <Footer />
      </div>
    );
  }

  const mainImage =
    product.images && product.images.length > 0
      ? product.images[selectedImage]
      : "/placeholder.png";

  // ✅ Static 30% discount
  const discountPercentage = 30;
  const discountPrice = Math.round(product.price - (product.price * discountPercentage) / 100);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <NavBar />

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
        {/* Left: Product Images */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md h-96 relative">
            {/* Discount Badge on Image */}
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg z-10">
              {discountPercentage}% OFF
            </span>
            <Image
              src={mainImage}
              alt={product.name || "Product Image"}
              fill
              className="object-cover rounded-xl shadow-md"
            />
          </div>

          <div className="flex gap-3 mt-4">
            {product.images &&
              product.images.length > 0 &&
              product.images.map((img: string, index: number) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-black" : "border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index}`}
                    fill
                    className="object-cover"
                  />
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
                  i < Math.floor(product.rating ?? 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-gray-600 text-sm">
              {product.rating ?? 0} / 5
            </span>
          </div>

          {/* Price Section */}
          <div className="mt-4 flex items-center gap-3">
            <p className="text-2xl font-bold text-green-600">₹{discountPrice}</p>
            <p className="text-lg line-through text-gray-500">₹{product.price}</p>
            <span className="bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded">
              {discountPercentage}% OFF
            </span>
          </div>

          {/* Category */}
          <p className="mt-2 text-sm text-gray-500">
            Category:{" "}
            <span className="font-medium text-gray-800">{product.category}</span>
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

      <Footer />
    </div>
  );
}
