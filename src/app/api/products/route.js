import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// ✅ DB Connection
const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: {
    rejectUnauthorized: false,
  },
});

// ✅ GET Products with Categories & Images
export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id, p.name, p.description, p.price, p.category_id, 
        c.name AS category,
        GROUP_CONCAT(pi.image_url) AS images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      GROUP BY p.id
      ORDER BY p.id DESC
    `);

    return NextResponse.json({ success: true, products: rows });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
