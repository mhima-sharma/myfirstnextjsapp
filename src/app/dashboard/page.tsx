"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = document.cookie.split("; ").find((c) => c.startsWith("token="))?.split("=")[1];
    if (!token) {
      router.push("/login");
      return;
    }

    // Optional: fetch user info
    fetch("/api/users", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setUser(data[0]))
      .catch(() => router.push("/login"));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user.name}!</p>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
    </div>
  );
}
