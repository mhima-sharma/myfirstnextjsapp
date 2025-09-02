import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// ✅ DB Connection
const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  ssl: { rejectUnauthorized: false },
});

// ✅ GET Products with Categories & Images
export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id, p.name, p.description, p.price, p.quantity, p.category_id,
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

// ✅ POST - Add New Product with Images & Quantity
export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const description = formData.get("description") || "";
    const price = Number(formData.get("price"));
    const quantity = Number(formData.get("quantity")) || 0; // ✅ Added quantity
    const category_id = Number(formData.get("category_id"));

    if (!name || !price || !category_id) {
      return NextResponse.json(
        { success: false, error: "Name, price, and category are required" },
        { status: 400 }
      );
    }

    // ✅ Insert product with quantity
    const [result] = await db.query(
      `INSERT INTO products (name, description, price, quantity, category_id) VALUES (?, ?, ?, ?, ?)`,
      [name, description, price, quantity, category_id]
    );
    const productId = result.insertId;

    // ✅ Handle images if provided
    const images = formData.getAll("images");
    if (images.length > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      // Ensure directory exists
      await mkdir(uploadDir, { recursive: true });

      const imageUrls = [];

      for (const image of images) {
        if (image && image.size > 0) {
          const fileName = `${Date.now()}-${image.name}`;
          const filePath = path.join(uploadDir, fileName);
          const buffer = Buffer.from(await image.arrayBuffer());

          await writeFile(filePath, buffer);
          imageUrls.push(`/uploads/${fileName}`);
        }
      }

      // ✅ Save image URLs in DB
      if (imageUrls.length > 0) {
        const imageValues = imageUrls.map((url) => [productId, url]);
        await db.query(
          `INSERT INTO product_images (product_id, image_url) VALUES ?`,
          [imageValues]
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "✅ Product added successfully",
      product_id: productId,
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add product" },
      { status: 500 }
    );
  }
}
