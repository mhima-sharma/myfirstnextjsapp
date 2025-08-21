import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// ✅ MySQL Connection
const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: true,
  },
});

// ✅ GET All Categories
export async function GET() {
  try {
    const [rows] = await db.query("SELECT id, name FROM categories ORDER BY name ASC");
    return NextResponse.json({ success: true, categories: rows });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
