
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/database";

export async function GET(req: NextRequest) {
  try {
    // ✅ Check Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const token = authHeader.split(" ")[1];
    if (!token)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    // ✅ Verify token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    // ✅ Fetch orders for this user
    const [orders]: any = await pool.query(
      `SELECT id, total, status, created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    console.error("GET /api/orders/my-orders error:", err);
    const message =
      err.name === "JsonWebTokenError" ? "Invalid token" : "Internal Server Error";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
