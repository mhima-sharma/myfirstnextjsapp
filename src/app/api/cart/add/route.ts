import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/database";

export async function POST(req: NextRequest) {
  try {
    const { user_id, product_id, quantity } = await req.json();

    if (!user_id) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }
    if (!product_id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const [existing]: any = await pool.query(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
      [user_id, product_id]
    );

    if (existing.length > 0) {
      await pool.query(
        "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
        [quantity || 1, user_id, product_id]
      );
    } else {
      await pool.query(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [user_id, product_id, quantity || 1]
      );
    }

    return NextResponse.json({ success: true, message: "Product added to cart" });
  } catch (error) {
    console.error("Add to Cart API Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
