import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

// ✅ Create DB connection pool
const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function GET() {
  try {
  const [products] = await db.query(
  `SELECT 
    p.id,
    p.name,
    p.description,
    p.price,
    ANY_VALUE(c.name) AS category,
    GROUP_CONCAT(i.image_url) AS images
   FROM products p
   LEFT JOIN categories c ON p.category_id = c.id
   LEFT JOIN product_images i ON p.id = i.product_id
   GROUP BY p.id
   ORDER BY p.id DESC`
);


    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error: any) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
