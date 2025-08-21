"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import SideAuth from "../sideAuth/page";

export default function NavBar() {
  const navCategories = ["Home","Outfits","Accessories","Gifts","Plants","Candles"];
  const [isOpen, setIsOpen] = useState(false);
  const [isSideAuthOpen, setIsSideAuthOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 p-2">
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

        {/* Single Sign In Button */}
        <div className="hidden md:flex gap-4">
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
              <Link key={cat} href={`/${cat.toLowerCase()}`} className="text-gray-700 hover:text-[#B39452] transition font-medium" onClick={() => setIsOpen(false)}>
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
    </header>
  );
}
