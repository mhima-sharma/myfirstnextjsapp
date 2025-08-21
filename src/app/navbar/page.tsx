"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingCart, User } from "lucide-react"; // Added icons
import SideAuth from "../sideAuth/page";

export default function NavBar() {
  const navCategories = ["Home", "Outfits", "Accessories", "Gifts", "Plants", "Candles"];
  const [isOpen, setIsOpen] = useState(false);
  const [isSideAuthOpen, setIsSideAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 p-2 text-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center h-20">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center h-full cursor-pointer mt-3">
            <Image src="/logo.png" alt="Logo" width={120} height={60} className="object-contain" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          {navCategories.map((cat) => (
            <Link
              key={cat}
              href={`/${cat.toLowerCase()}`}
              className="text-gray-700 hover:text-[#B39452] transition font-medium"
            >
              {cat}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Icons */}
        <div className="hidden md:flex gap-4 items-center">
          {/* Cart */}
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ShoppingCart size={24} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              3 {/* Example: number of items in cart */}
            </span>
          </button>

          {/* User/Profile */}
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <User size={24} />
          </button>

          {/* Sign In */}
          <button
            onClick={() => setIsSideAuthOpen(true)}
            className="px-4 py-2 bg-[#B39452] text-white rounded-full hover:bg-[#9d8147] transition"
          >
            Sign In
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-700 focus:outline-none">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <nav className="flex flex-col gap-4 px-6 py-4">
            {navCategories.map((cat) => (
              <Link
                key={cat}
                href={`/${cat.toLowerCase()}`}
                className="text-gray-700 hover:text-[#B39452] transition font-medium"
                onClick={() => setIsOpen(false)}
              >
                {cat}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3 px-6 pb-4">
            <button
              onClick={() => { setIsOpen(false); setIsSideAuthOpen(true); }}
              className="w-full px-4 py-2 bg-[#B39452] text-white rounded-full hover:bg-[#9d8147] transition"
            >
              Sign In
            </button>
          </div>
        </div>
      )}

      {/* Side Auth Drawer */}
      <SideAuth
        isOpen={isSideAuthOpen}
        onClose={() => setIsSideAuthOpen(false)}
      />

      {/* Example Cart Drawer */}
      {isCartOpen && (
        <div className="fixed right-0 top-0 w-80 h-full bg-white shadow-lg z-50 p-4">
          <h2 className="text-xl font-bold mb-4">Cart</h2>
          <p>Your cart items will appear here.</p>
          <button
            onClick={() => setIsCartOpen(false)}
            className="mt-4 px-4 py-2 bg-[#B39452] text-white rounded hover:bg-[#9d8147]"
          >
            Close
          </button>
        </div>
      )}

      {/* Example Profile Dropdown */}
      {isProfileOpen && (
        <div className="fixed right-4 top-20 w-48 bg-white shadow-lg rounded-md z-50 p-4">
          <p className="font-medium mb-2">User Profile</p>
          <Link href="/profile" className="block px-2 py-1 hover:bg-gray-100 rounded">My Account</Link>
          <Link href="/orders" className="block px-2 py-1 hover:bg-gray-100 rounded">Orders</Link>
          <Link href="/logout" className="block px-2 py-1 hover:bg-gray-100 rounded">Logout</Link>
           <Link href="/admin/login" className="block px-2 py-1 hover:bg-gray-100 rounded">Admin</Link>
        </div>
      )}
    </header>
  );
}
