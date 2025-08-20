"use client";

import Image from "next/image";

export default function HeroSection() {
  const categories = [
    { name: "Outfits", image: "/outfits.png" },
    { name: "Accessories", image: "/accessories.png" },
    { name: "Gifts", image: "/gifts.png" },
    { name: "Plants", image: "/plants.png" },
    { name: "Candles", image: "/candles.png" },
  ];

  return (
    <>
      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 pt-20 pb-12">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Shop by Categories
        </h3>

        <div className="flex flex-wrap justify-center gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer group"
            >
              {/* Category Image */}
              <div className="w-32 h-24 rounded-full overflow-hidden relative shadow-md border border-gray-200 group-hover:shadow-lg transition-all duration-300">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Category Name */}
              <p className="mt-3 text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto pt-10 pb-16 px-4">
        {/* Left Side */}
        <div className="flex flex-col justify-center gap-4">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Modern Look & Clean Style
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Discover trendy, comfortable, and luxurious outfits for any occasion.
          </p>
          <button className="mt-4 bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 w-40">
            Buy Now
          </button>
        </div>

        {/* Right Side Image */}
        <div className="w-full h-96 relative rounded-lg overflow-hidden">
          <Image
            src="/herosection.png"
            alt="Fashion Hero"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>
    </>
  );
}
