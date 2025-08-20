export default function Home() {
  const categories = ["Men", "Women", "Kids", "Accessories"];
  const products = [
    { name: "Casual Shirt", price: "$29.99" },
    { name: "Denim Jacket", price: "$59.99" },
    { name: "Summer Dress", price: "$39.99" },
    { name: "Sneakers", price: "$49.99" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      {/* Navbar */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clothify</h1>
          <nav className="space-x-4">
            {categories.map((cat) => (
              <a
                key={cat}
                href="#"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {cat}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-[400px] sm:h-[500px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-b-xl">
        <div className="text-center text-white">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Discover Your Style</h2>
          <p className="text-lg sm:text-xl mb-6">Trendy clothes for men, women, and kids</p>
          <a className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition" href="#">
            Shop Now
          </a>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6">
        <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Shop by Category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={cat}
              className={`flex items-center justify-center h-40 rounded-xl text-white font-bold text-lg bg-gray-300 dark:bg-gray-700`}
            >
              {cat}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6">
        <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Featured Products</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.name} className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col items-center">
              {/* Image placeholder */}
              <div className="w-full h-40 mb-4 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              <h4 className="text-gray-900 dark:text-white font-semibold mb-2">{product.name}</h4>
              <span className="text-gray-700 dark:text-gray-300 font-medium">{product.price}</span>
              <button className="mt-4 bg-black text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-800 transition w-full">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Clothify. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
