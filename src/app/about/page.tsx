"use client";

import Image from "next/image";
import NavBar from "../navbar/page";
import Footer from "../footer/page";

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      {/* Header / NavBar */}
      <header className="fixed top-0 left-0 w-full z-50 shadow-lg bg-white dark:bg-black transition-colors">
        <NavBar />
      </header>

      {/* About Section */}
      <section className="min-h-screen py-20 px-6 md:px-16 pt-28">
        {/* Header Section */}
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            About{" "}
            <span className="text-primary italic border-b-4 border-primary">
              LuxeLoom
            </span>
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
            Welcome to <span className="font-semibold">LuxeLoom</span>, where luxury meets craftsmanship.
            We bring you curated collections of timeless outfits, accessories, and décor essentials
            designed for modern elegance and effortless style.
          </p>
        </div>

        {/* Image Banner */}
        <div className="max-w-6xl mx-auto mt-10">
          <Image
            src="/herosection.png"
            alt="About LuxeLoom"
            width={1200}
            height={300}
            className="rounded-2xl shadow-lg w-full object-cover h-[280px] md:h-[350px]"
          />
        </div>

        {/* Our Story */}
        <div className="max-w-6xl mx-auto mt-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">✨ Our Story</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              LuxeLoom was founded with a vision to redefine premium fashion and home lifestyle.
              Our designs reflect sophistication, comfort, and elegance — crafted with the finest
              materials to complement your individuality and elevate your everyday living.
            </p>
            <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
              Every product is thoughtfully created, blending tradition with innovation,
              to offer a seamless luxury experience you can trust and cherish.
            </p>
          </div>
          <div>
            <Image
              src="/story.png"
              alt="LuxeLoom Story"
              width={500}
              height={350}
              className="rounded-xl shadow-md w-full object-cover h-[260px] md:h-[320px]"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 mt-20">
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🌟 Our Mission</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              To craft timeless pieces that embody elegance, comfort, and style,
              helping you express your personality through our luxurious designs.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-lg transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🌍 Our Vision</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              To become a global symbol of refined luxury, inspiring confidence and
              celebrating individuality through every LuxeLoom creation.
            </p>
          </div>
        </div>

        {/* Our Core Values */}
        <div className="max-w-6xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
            Our Core Values
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mt-2 max-w-2xl mx-auto">
            LuxeLoom stands on a foundation of excellence, sustainability, and creativity.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl shadow-md text-center hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Quality</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Premium materials and craftsmanship for unmatched luxury.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl shadow-md text-center hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Sustainability</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Eco-friendly practices that respect nature and future generations.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl shadow-md text-center hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Innovation</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Designs that blend tradition with modern elegance effortlessly.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-6xl mx-auto mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Step Into Luxury with LuxeLoom ✨
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our latest collections and transform your style with elegance and grace.
          </p>
          <a
            href="/shop"
            className="mt-6 inline-block bg-primary hover:bg-gray-900 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-md transition-transform hover:scale-105"
          >
            Discover Our Collection
          </a>
        </div>
      </section>

      {/* Footer */}
      <main className="flex flex-col gap-[32px] items-center sm:items-start mt-[80px] px-4 w-full">
        <Footer />
      </main>
    </div>
  );
}
