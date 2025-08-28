import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/database";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, txnid, status } = body;

    // ✅ Update Razorpay Payments
    if (razorpay_order_id) {
      await pool.query(
        "UPDATE payments SET payment_id=?, status=? WHERE order_id=?",
        [razorpay_payment_id, "success", razorpay_order_id]
      );
    }

    // ✅ Update Easebuzz Payments
    if (txnid) {
      const newStatus = status === "success" ? "success" : "failed";
      await pool.query(
        "UPDATE payments SET status=? WHERE order_id=?",
        [newStatus, txnid]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
