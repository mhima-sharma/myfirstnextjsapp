"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch logged-in user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) fetchUserProfile();
  }, [isOpen]);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b bg-[#fff]">
        <h2 className="text-lg font-semibold text-gray-800">My Profile</h2>
        <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
          <X size={22} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading profile...</p>
        ) : user ? (
          <div className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <img
                src="/images/default-avatar.png" // ✅ Always use static avatar
                alt="Profile"
                className="w-24 h-24 rounded-full border shadow"
              />
              <h3 className="mt-3 text-xl font-semibold text-gray-900">
                {user.name || "User"}
              </h3>
              <p className="text-gray-500 text-sm">
                {user.email || "No email provided"}
              </p>
            </div>

            {/* Profile Details */}
            <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-lg shadow-sm">
              <div>
                <p className="font-medium text-gray-700">Phone:</p>
                <p className="text-gray-600">{user.phone || "Not added"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Joined:</p>
                <p className="text-gray-600">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* My Orders Button */}
            <Link
              href="/orders"
              onClick={onClose}
              className="block text-center w-full px-4 py-2 bg-[#B39452] text-white rounded-full hover:bg-[#9d8147] transition shadow"
            >
              My Orders
            </Link>

            {/* Logout Button */}
            <button
              onClick={() => {
                localStorage.removeItem("token"); // ✅ Remove token
                signOut({ callbackUrl: "/" }); // ✅ Redirect to home
                onClose();
              }}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-gray-500">You are not logged in.</p>
            <Link
              href="/login"
              onClick={onClose}
              className="block text-center w-full px-4 py-2 bg-[#B39452] text-white rounded-full hover:bg-[#9d8147] transition shadow"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
