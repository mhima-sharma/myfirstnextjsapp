import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/database";

export async function POST(req: NextRequest) {
  const connection = await pool.getConnection();
  try {
    const body = await req.json();
    console.log("webhook data_________", body);

    const {
      user_id,
      order_id,
      total,
      status,
      full_name,
      phone,
      address,
      city,
      pincode,
    } = body;

    // ✅ Step 1: Save delivery address first
    const [addressResult]: any = await connection.query(
      `INSERT INTO delivery_addresses (user_id, full_name, phone, address, city, pincode)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, full_name, phone, address, city, pincode]
    );

    const deliveryAddressId = addressResult.insertId;

    // ✅ Step 2: Save order with delivery_address_id
    await connection.query(
      `INSERT INTO orders (user_id, order_id, delivery_address_id, total, status, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [user_id, order_id, deliveryAddressId, total, status || "processing"]
    );

    // ✅ Step 3: Update payment status in the payments table
    await connection.query(
      `UPDATE payments 
       SET status = ? 
       WHERE order_id = ?`,
      [status || "success", order_id]
    );

    return NextResponse.json({
      success: true,
      message: "Order placed successfully & payment status updated!",
    });
  } catch (error: any) {
    console.error("Payment Webhook Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
