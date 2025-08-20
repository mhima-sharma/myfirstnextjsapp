export default function HeroSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto pt-32 pb-16 px-4">
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
      <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Hero Image</span>
      </div>
    </section>
  );
}
