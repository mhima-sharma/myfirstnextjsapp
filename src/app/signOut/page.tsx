"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [storeToken, setStoreToken] = useState<string | null>(null);

  // ✅ Access localStorage only on client
  useEffect(() => {
    const token = localStorage.getItem("token");
    setStoreToken(token);
  }, []);

  const isLoggedIn = !!storeToken;

  const handleLogout = () => {
    // 1️⃣ Remove token from localStorage
    localStorage.removeItem("token");
    setStoreToken(null);

    // 2️⃣ Sign out NextAuth session (optional)
    signOut({ callbackUrl: "/" });
  };

  return (
    <nav>
      {isLoggedIn ? (
        <>
          <p>Welcome!</p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => console.log("Open login modal")}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Sign In
        </button>
      )}
    </nav>
  );
}
