import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/database"; // Your MySQL connection
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    // Clear cart for this user
    await pool.query("DELETE FROM cart WHERE user_id = ?", [userId]);

    return NextResponse.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    console.error("❌ Error clearing cart:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
