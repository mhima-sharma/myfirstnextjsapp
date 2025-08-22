"use client";

import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";

export default function Footer(){
    return (
<footer className="bg-gray-900 text-gray-300 pt-12 pb-6 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-white">LuxeLoom</h2>
          <p className="mt-3 text-gray-400">
            Your one-stop destination for luxury fashion, lifestyle, and home essentials.
          </p>
          <div className="flex space-x-4 mt-5">
            <a href="#" className="bg-gray-700 hover:bg-purple-600 p-2 rounded-full transition">
              <FaFacebookF size={16} />
            </a>
            <a href="#" className="bg-gray-700 hover:bg-purple-600 p-2 rounded-full transition">
              <FaInstagram size={16} />
            </a>
            <a href="#" className="bg-gray-700 hover:bg-purple-600 p-2 rounded-full transition">
              <FaTwitter size={16} />
            </a>
            <a href="#" className="bg-gray-700 hover:bg-purple-600 p-2 rounded-full transition">
              <FaLinkedinIn size={16} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-purple-400 transition">Home</a></li>
            <li><a href="/Shop" className="hover:text-purple-400 transition">Shop</a></li>
            <li><a href="/about" className="hover:text-purple-400 transition">About Us</a></li>
            <li><a href="/contact" className="hover:text-purple-400 transition">Contact</a></li>
            <li><a href="/terms" className="hover:text-purple-400 transition">Terms & Conditions</a></li>

          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
          <ul className="space-y-2">
            <li><a href="/Shop" className="hover:text-purple-400 transition">Outfits</a></li>
            <li><a href="/Shop" className="hover:text-purple-400 transition">Accessories</a></li>
            <li><a href="/Shop" className="hover:text-purple-400 transition">Gifts</a></li>
            <li><a href="/Shop" className="hover:text-purple-400 transition">Plants</a></li>
            <li><a href="/Shop" className="hover:text-purple-400 transition">Candles</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <p className="text-gray-400">📍 LuxeLoom , India</p>
          <p className="text-gray-400">📧 mahimasharma052002@gmail.com </p>
          <p className="text-gray-400">📞 +91 79885 43___</p>
        </div>
      </div>
{/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8 pt-5 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} LuxeLoom. All rights reserved. | Designed with ❤️ by LuxeLoom Team
      </div>
    </footer>);
    }