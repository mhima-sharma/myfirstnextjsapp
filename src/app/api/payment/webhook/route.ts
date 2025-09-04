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
      items, // ✅ expected array but may be missing
    } = body;

    await connection.beginTransaction();

    // ✅ Step 1: Save delivery address
    const [addressResult]: any = await connection.query(
      `INSERT INTO delivery_addresses (user_id, full_name, phone, address, city, pincode)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, full_name, phone, address, city, pincode]
    );

    const deliveryAddressId = addressResult.insertId;

    // ✅ Step 2: Save order
    await connection.query(
      `INSERT INTO orders (user_id, order_id, delivery_address_id, total, status, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [user_id, order_id, deliveryAddressId, total, status || "processing"]
    );

    // ✅ Step 3: Save order items & update stock (only if items exist)
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        // Insert order item
        await connection.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES (?, ?, ?, ?)`,
          [order_id, item.product_id, item.quantity, item.price]
        );

        // Update stock safely
        const [updateResult]: any = await connection.query(
          `UPDATE products 
           SET quantity = quantity - ? 
           WHERE id = ? AND quantity >= ?`,
          [item.quantity, item.product_id, item.quantity]
        );

        if (updateResult.affectedRows === 0) {
          throw new Error(
            `Not enough stock for product ID: ${item.product_id}`
          );
        }
      }
    } else {
      console.warn("⚠️ No items provided in webhook payload");
    }

    // ✅ Step 4: Update payment status
    await connection.query(
      `UPDATE payments 
       SET status = ? 
       WHERE order_id = ?`,
      [status || "success", order_id]
    );

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: "Order placed, stock updated (if items), payment status updated!",
    });
  } catch (error: any) {
    await connection.rollback();
    console.error("Payment Webhook Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
