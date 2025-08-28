import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import {pool} from "@/lib/database";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const [cart]: any = await pool.query(
      `SELECT c.id, c.quantity, p.name, p.price, p.images 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = ?`,
      [userId]
    );

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error("Fetch Cart API Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
