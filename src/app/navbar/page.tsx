"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingCart, User, Trash2, Plus } from "lucide-react";
import SideAuth from "../sideAuth/page";
import ProfileDrawer from "../profileDrawer/page";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSideAuthOpen, setIsSideAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [showGiftMsg, setShowGiftMsg] = useState(true);

  const [storeToken, setStoreToken] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showAllQuickAdds, setShowAllQuickAdds] = useState(false);

  const isLoggedIn = !!storeToken;

  // ✅ Load token & cart from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    setStoreToken(token);

    if (token) {
      fetch("/api/cart", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setCart(data.cart);
        })
        .catch((err) => console.error("❌ Error fetching cart:", err));
    }
  }, []);

  // ✅ Fetch products for Quick Add
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products/get");
        const data = await res.json();
        if (data.success) setProducts(data.products);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchProducts();
  }, []);

  // ✅ Cart Operations
  const updateCartBackend = async (payload: any) => {
    if (!storeToken) {
      setIsSideAuthOpen(true);
      return;
    }
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storeToken}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) setCart(data.cart);
    } catch (err) {
      console.error("❌ Cart operation error:", err);
    }
  };

  const handleAddToCart = (product: any) => {
    updateCartBackend({ product_id: product.id, quantity: 1 });
  };

  const handleRemoveFromCart = (product_id: string) => {
    updateCartBackend({ product_id, remove: true });
  };

  const handleIncreaseQty = (product_id: string) => {
    updateCartBackend({ product_id, quantity_change: 1 });
  };

  const handleDecreaseQty = (product_id: string) => {
    updateCartBackend({ product_id, quantity_change: -1 });
  };

  // ✅ 30% Discount Calculation
  const getDiscountedPrice = (price: number) => price - price * 0.3;

  // ✅ Totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalDiscount = cart.reduce((acc, item) => acc + item.price * 0.3 * item.quantity, 0);
  const discountedTotal = subtotal - totalDiscount;
  const platformFee = cart.length > 0 ? 10 : 0;
  const grandTotal = discountedTotal + platformFee;

  return (
    <>
      {/* 🎁 Surprise Gift */}
      {isLoggedIn && showGiftMsg && (
        <div className="fixed bottom-4 right-4 bg-amber-100 text-amber-800 px-4 py-3 rounded shadow-lg flex items-center justify-between gap-4 z-50">
          <span>🎁 Surprise Gift from Luxeloom! Don’t miss out.</span>
          <button onClick={() => setShowGiftMsg(false)} className="text-gray-600 hover:text-gray-800">
            ✕
          </button>
        </div>
      )}

      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-40 p-2 text-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center h-full cursor-pointer mt-3">
              <Image src="/logo.png" alt="Logo" width={120} height={60} className="object-contain" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-gray-700 hover:text-[#B39452] transition font-medium">Home</Link>
            <Link href="/Shop" className="text-gray-700 hover:text-[#B39452] transition font-medium">Shop</Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#B39452] transition font-medium">Contact</Link>
            <Link href="/about" className="text-gray-700 hover:text-[#B39452] transition font-medium">About</Link>
            <Link href="/offers" className="text-gray-700 hover:text-[#B39452] transition font-medium">Offers</Link>
            <Link href="/reviews" className="text-gray-700 hover:text-[#B39452] transition font-medium">Examiners</Link>
          </nav>

          {/* Desktop Right Icons */}
          <div className="hidden md:flex gap-4 items-center">
            {/* Cart */}
            <button onClick={() => setIsCartOpen(!isCartOpen)} className="relative p-2 rounded-full hover:bg-gray-100 transition">
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Profile */}
            {isLoggedIn && (
              <button onClick={() => setIsProfileDrawerOpen(true)} className="p-2 rounded-full hover:bg-gray-100 transition">
                <User size={24} />
              </button>
            )}

            {/* Sign In */}
            {!isLoggedIn && (
              <button onClick={() => setIsSideAuthOpen(true)} className="px-4 py-2 bg-[#B39452] text-white rounded-full hover:bg-[#9d8147] transition">
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700 focus:outline-none">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Side Auth */}
        <SideAuth isOpen={isSideAuthOpen} onClose={() => setIsSideAuthOpen(false)} />

        {/* Cart Drawer */}
        {isCartOpen && (
          <div className="fixed right-0 top-0 w-96 h-full bg-white shadow-lg z-50 p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Your Cart</h2>

            {/* Cart Items */}
            {cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {cart.map((item) => {
                  const discountedPrice = getDiscountedPrice(item.price);
                  return (
                    <div key={item.id} className="flex items-center gap-3 border-b pb-3">
                      <Image src={item.images[0]} alt={item.name} width={60} height={60} className="rounded-md object-cover" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-green-600 font-bold">₹{discountedPrice}</p>
                          <p className="text-gray-400 line-through text-sm">₹{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => handleDecreaseQty(item.id)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                          <span className="px-2">{item.quantity}</span>
                          <button onClick={() => handleIncreaseQty(item.id)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                        </div>
                      </div>
                      <button onClick={() => handleRemoveFromCart(item.id)} className="p-1 text-red-500 hover:bg-gray-100 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Add Products */}
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Add (30% OFF)</h3>
              {loadingProducts ? (
                <p className="text-gray-500">Loading products...</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {(showAllQuickAdds ? products : products.slice(0, 4)).map((product) => {
                    const discountedPrice = getDiscountedPrice(product.price);
                    return (
                      <div key={product.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2 shadow-sm">
                        <div className="flex items-center gap-3">
                          <Image
                            src={product.images?.split(",")[0]}
                            alt={product.name}
                            width={50}
                            height={50}
                            className="rounded-md object-cover"
                          />
                          <div>
                            <h4 className="font-medium text-gray-800">{product.name}</h4>
                            <div className="flex items-center gap-2">
                              <p className="text-green-600 font-semibold">₹{discountedPrice}</p>
                              <p className="text-gray-400 line-through text-sm">₹{product.price}</p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="p-2 bg-[#B39452] text-white rounded-full hover:bg-[#9d8147] transition"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    );
                  })}

                  {/* Show More / Show Less */}
                  {products.length > 4 && (
                    <button
                      onClick={() => setShowAllQuickAdds(!showAllQuickAdds)}
                      className="mt-3 text-[#B39452] hover:underline font-medium text-sm"
                    >
                      {showAllQuickAdds ? "Show Less" : "Show More"}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            {cart.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600 mb-2">
                  <span>Discount (30%):</span>
                  <span>- ₹{totalDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Platform Fee:</span>
                  <span>₹{platformFee}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total Payable:</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 block w-full text-center px-4 py-2 bg-[#B39452] text-white rounded-lg hover:bg-[#9d8147] transition"
                >
                  Checkout
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        )}

        {/* Profile Drawer */}
        <ProfileDrawer isOpen={isProfileDrawerOpen} onClose={() => setIsProfileDrawerOpen(false)} />
      </header>
    </>
  );
}
