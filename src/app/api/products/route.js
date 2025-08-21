import mysql from "mysql2/promise";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

// ✅ Create a single DB connection pool
const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false, // ✅ Fix SSL issues for cloud DBs
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const category_id = formData.get("category_id");
    const images = formData.getAll("images");

    // ✅ Insert product into database
    const [result] = await db.query(
      "INSERT INTO products (name, description, price, category_id) VALUES (?, ?, ?, ?)",
      [name, description, price, category_id]
    );

    const productId = result.insertId;

    // ✅ Upload images to Cloudinary & store URLs
    for (const image of images) {
      const buffer = Buffer.from(await image.arrayBuffer());

      const uploaded = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      await db.query(
        "INSERT INTO product_images (product_id, image_url) VALUES (?, ?)",
        [productId, uploaded.secure_url]
      );
    }

    return NextResponse.json({
      success: true,
      message: "✅ Product added successfully",
      productId,
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
