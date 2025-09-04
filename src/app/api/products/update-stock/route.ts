import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/database";

export async function POST(req: NextRequest) {
  const connection = await pool.getConnection();
  try {
    const body = await req.json();

    // ✅ Normalize items (supports both {cart: [...]} and raw array)
    const items = Array.isArray(body) ? body : body.cart;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "No items provided" },
        { status: 400 }
      );
    }

    await connection.beginTransaction();

    for (const item of items) {
      await connection.query(
        `UPDATE products 
         SET quantity = GREATEST(quantity - ?, 0)
         WHERE id = ?`,
        [item.quantity, item.product_id]
      );
    }

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: "Stock updated successfully",
    });
  } catch (error: any) {
    await connection.rollback();
    console.error("Update-stock error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
