"use client";

import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  return (
    <nav>
      {isLoggedIn ? (
        <>
          <p>Welcome, {session.user?.name}</p>
          <button
            onClick={() => signOut({ callbackUrl: "/" })} // ✅ Clear session and redirect to home
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
