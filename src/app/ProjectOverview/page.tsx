"use client";

export default function ProjectOverview() {
  return (
    
    <section className="bg-gray-50 dark:bg-gray-900 py-16 px-6 md:px-16">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          LuxeLoom 
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          LuxeLoom is a premium e-commerce platform designed for fashion, lifestyle, and home décor products, offering a seamless shopping experience with a modern and aesthetic interface.
        </p>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">🛍️ Premium Shopping</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Browse through curated collections of outfits, accessories, gifts, plants, and candles with a stunning 3D carousel display.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">💳 Secure Payments</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Integrated with Razorpay and Easebuzz for smooth and secure checkout. Also supports Google Places Autocomplete for faster address entry.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">⚡ Real-time Experience</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Experience a responsive, fast, and interactive UI powered by Next.js, Node.js, and MySQL with seamless image uploads via Cloudinary.
          </p>
        </div>
      </div>
    </section>
  );
}
