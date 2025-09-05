
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingCart, User, Trash2 } from "lucide-react";
import SideAuth from "../sideAuth/page";
import ProfileDrawer from "../profileDrawer/page";

interface CartItem {
  id: string;
  name: string;
  price: number;
  images: string[];
  quantity: number;
}

interface Product {
  id?: string;
  _id?: string; // Added for MongoDB/Next API compatibility
  name: string;
  price: number;
  images: string;
  quantity: number;
}

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSideAuthOpen, setIsSideAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [showGiftMsg, setShowGiftMsg] = useState(true);
  const [storeToken, setStoreToken] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const isLoggedIn = !!storeToken;

  // Load token & fetch cart
  useEffect(() => {
    const token = localStorage.getItem("token");
    setStoreToken(token);

    if (token) {
      fetch("/api/cart", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.status === 401) {
            localStorage.removeItem("token");
            setStoreToken(null);
            setCart([]);
            setIsSideAuthOpen(true);
            throw new Error("Token expired. Please login again.");
          }
          return res.json();
        })
        .then((data) => {
          if (data.success) setCart(data.cart);
        })
        .catch((err) => console.error("❌ Error fetching cart:", err));
    }
  }, []);

  // Fetch products for stock check
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products/get");
        const data = await res.json();
        if (data.success) {
          console.log("✅ Products Fetched:", data.products);
          setProducts(data.products);
        }
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchProducts();
  }, []);

  // Update Cart Backend Helper
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

  // Cart Operations
  const handleAddToCart = (product: Product) => {
    const cartItem = cart.find((item) => item.id === (product.id || product._id));
    const currentQty = cartItem ? cartItem.quantity : 0;

    if (currentQty + 1 > product.quantity) {
      alert("Cannot add more than available stock!");
      return;
    }

    updateCartBackend({ product_id: product.id || product._id, quantity: 1 });
  };

  const handleIncreaseQty = (product_id: string) => {
    const cartItem = cart.find((item) => item.id === product_id);
    const product = products.find((p) => p.id === product_id || p._id === product_id);
    if (!cartItem || !product) return;

    if (cartItem.quantity + 1 > product.quantity) {
      alert("Cannot increase beyond available stock!");
      return;
    }

    updateCartBackend({ product_id, quantity_change: 1 });
  };

  const handleDecreaseQty = (product_id: string) => {
    const cartItem = cart.find((item) => item.id === product_id);
    if (!cartItem) return;

    if (cartItem.quantity <= 1) {
      handleRemoveFromCart(product_id);
      return;
    }

    updateCartBackend({ product_id, quantity_change: -1 });
  };

  const handleRemoveFromCart = (product_id: string) => {
    if (!storeToken) return setIsSideAuthOpen(true);

    setCart((prev) => prev.filter((item) => item.id !== product_id));
    updateCartBackend({ product_id, remove: true });
  };

  // Clear Cart After Successful Payment
  const clearCart = async () => {
    if (!storeToken) return;
    try {
      const res = await fetch("/api/cart/clear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storeToken}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setCart([]);
        setIsCartOpen(false);
      }
    } catch (err) {
      console.error("❌ Error clearing cart:", err);
    }
  };

  // Checkout Handler
  const handleCheckout = () => {
    window.location.href = "/checkout";
  };

  // Discount Calculation
  const getDiscountedPrice = (price: number) => price - price * 0.3;

  // Totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalDiscount = cart.reduce((acc, item) => acc + item.price * 0.3 * item.quantity, 0);
  const discountedTotal = subtotal - totalDiscount;
  const platformFee = cart.length > 0 ? 10 : 0;
  const grandTotal = discountedTotal + platformFee;

  // 🚨 Check if cart has invalid quantities
  const hasOverStock = cart.some((item) => {
    const product = products.find((p) => p.id === item.id || p._id === item.id);
    return product ? item.quantity > product.quantity : false;
  });

  return (
    <>
      {/* 🎁 Floating Surprise Gift */}
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
            {[{ href: "/", label: "Home" }, { href: "/Shop", label: "Shop" }, { href: "/contact", label: "Contact" }, { href: "/about", label: "About" }, { href: "/offers", label: "Offers" }, { href: "/reviews", label: "Examiners" }].map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-700 hover:text-[#B39452] transition font-medium">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Icons */}
          <div className="hidden md:flex gap-4 items-center">
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 rounded-full hover:bg-gray-100 transition">
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {isLoggedIn ? (
              <button onClick={() => setIsProfileDrawerOpen(true)} className="p-2 rounded-full hover:bg-gray-100 transition">
                <User size={24} />
              </button>
            ) : (
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

        {/* Mobile Menu */}
        {isOpen && (
          <nav className="md:hidden bg-white shadow-md w-full py-4 px-6 flex flex-col gap-4">
            {[{ href: "/", label: "Home" }, { href: "/Shop", label: "Shop" }, { href: "/contact", label: "Contact" }, { href: "/about", label: "About" }, { href: "/offers", label: "Offers" }, { href: "/reviews", label: "Examiners" }].map((link) => (
              <Link key={`mobile-${link.href}`} href={link.href} className="text-gray-700 hover:text-[#B39452] transition font-medium">
                {link.label}
              </Link>
            ))}

            <div className="flex gap-4 items-center">
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 rounded-full hover:bg-gray-100 transition">
                <ShoppingCart size={24} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              {isLoggedIn ? (
                <button onClick={() => setIsProfileDrawerOpen(true)} className="p-2 rounded-full hover:bg-gray-100 transition">
                  <User size={24} />
                </button>
              ) : (
                <button onClick={() => setIsSideAuthOpen(true)} className="px-4 py-2 bg-[#B39452] text-white rounded-full hover:bg-[#9d8147] transition">
                  Sign In
                </button>
              )}
            </div>
          </nav>
        )}

        {/* Side Auth */}
        <SideAuth isOpen={isSideAuthOpen} onClose={() => setIsSideAuthOpen(false)} />

        {/* Cart Drawer */}
        {isCartOpen && (
          <div className="fixed right-0 top-0 w-full md:w-96 h-full bg-white shadow-lg z-50 p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Your Cart</h2>

            {cart.length > 0 && showGiftMsg && (
              <div className="mb-4 p-3 bg-amber-100 text-amber-800 rounded shadow flex items-center justify-between">
                <span>🎁 Surprise Gift from Luxeloom! Don’t miss out.</span>
                <button
                  onClick={() => setShowGiftMsg(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>
            )}

            {cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {cart.map((item) => {
                  const product = products.find((p) => p.id === item.id || p._id === item.id);
                  const availableQty = product ? product.quantity : 0;
                  const discountedPrice = getDiscountedPrice(item.price);
                  const isOverStock = item.quantity > availableQty;

                  return (
                    <div key={`cart-${item.id}`} className="flex items-center gap-3 border-b pb-3 relative">
                      {/* Product Image */}
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-md object-cover"
                      />

                      <div className="flex-1">
                        {/* Product Name */}
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>

                        {/* Price + Stock */}
                        <div className="flex items-center gap-2">
                          <p className="text-green-600 font-bold">₹{discountedPrice}</p>
                          <p className="text-gray-400 line-through text-sm">₹{item.price}</p>
                          <span className="text-sm text-gray-500">
                            Available: {availableQty > 0 ? availableQty : "Out of stock"}
                          </span>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2">Quantity: {item.quantity}</span>
                        </div>

                        {/* Show Warning if Added Qty > Available */}
                        {isOverStock && (
                          <div className="mt-2 bg-red-100 text-red-700 text-xs px-3 py-2 rounded-md shadow-sm flex flex-col gap-2">
                            <p>⚠ Out of stock!</p>
                           

                            {/* <div className="flex gap-2">
                              <button
                                onClick={() => updateCartBackend({ product_id: item.id, quantity: availableQty })}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                              >
                                Update to {availableQty}
                              </button>
                              <button
                                onClick={() =>
                                  alert(
                                    `You still have ${item.quantity} items in cart but only ${availableQty} are available.`
                                  )
                                }
                                className="px-3 py-1 bg-gray-300 text-gray-800 text-xs rounded hover:bg-gray-400"
                              >
                                Keep Current
                              </button>
                            </div> */}
                          </div>
                        )}

                        {/* ✅ LuxeLoom Badge */}
                        <div className="flex items-center gap-2 mt-2">
                          <Image
                            src="/logo2.png"
                            alt="LuxeLoom Logo"
                            width={40}
                            height={40}
                            className="rounded-full shadow-md"
                          />
                          <span className="text-xs text-gray-500">LuxeLoom Verified</span>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="p-1 text-red-500 hover:bg-gray-100 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

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
                <button
                  onClick={handleCheckout}
                  disabled={hasOverStock}
                  className={`mt-4 block w-full text-center px-4 py-2 rounded-lg transition 
                    ${hasOverStock 
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                      : "bg-[#B39452] text-white hover:bg-[#9d8147]"}`}
                >
                  {hasOverStock ? "Fix Stock Issues to Checkout" : "Checkout"}
                </button>
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
