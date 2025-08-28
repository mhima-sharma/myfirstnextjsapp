// /app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/database";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const [cart]: any = await pool.query(
      `SELECT 
        c.product_id,
        ANY_VALUE(c.quantity) AS quantity,
        ANY_VALUE(p.name) AS name,
        ANY_VALUE(p.price) AS price,
        ANY_VALUE(ca.name) AS category,
        GROUP_CONCAT(pi.image_url) AS images
      FROM cart c
      JOIN products p ON c.product_id = p.id
      LEFT JOIN categories ca ON p.category_id = ca.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE c.user_id = ?
      GROUP BY c.product_id`,
      [userId]
    );

    const cartWithImages = (cart as any[]).map(item => ({
      product_id: item.product_id,
      quantity: Number(item.quantity),
      name: item.name,
      price: Number(item.price),
      category: item.category,
      images: item.images ? item.images.split(",") : [],
    }));

    return NextResponse.json({ success: true, cart: cartWithImages });
  } catch (err: any) {
    console.error("GET /api/cart error:", err);
    const message = err.name === "JsonWebTokenError" ? "Invalid token" : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const { product_id, quantity } = await req.json();
    if (!product_id || !quantity || quantity <= 0) return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });

    const [existingCart]: any = await pool.query(
      `SELECT * FROM cart WHERE user_id = ? AND product_id = ?`,
      [userId, product_id]
    );

    if (existingCart.length > 0) {
      await pool.query(
        `UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?`,
        [quantity, userId, product_id]
      );
    } else {
      await pool.query(
        `INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)`,
        [userId, product_id, quantity]
      );
    }

    return NextResponse.json({ success: true, message: "Item added to cart" });
  } catch (err: any) {
    console.error("POST /api/cart error:", err);
    const message = err.name === "JsonWebTokenError" ? "Invalid token" : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
