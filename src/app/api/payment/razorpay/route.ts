import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { pool } from "@/lib/database";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, userId } = body;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    // ✅ Create Razorpay Order
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    });

    // ✅ Insert pending payment in DB
    const [result] = await pool.query(
      "INSERT INTO payments (user_id, order_id, gateway, amount, status) VALUES (?, ?, ?, ?, ?)",
      [userId, order.id, "razorpay", amount, "pending"]
    );

    return NextResponse.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
