import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/database";

export async function POST(req: NextRequest) {
  const connection = await pool.getConnection();
  try {
    const body = await req.json();
    console.log("Request Body:", body);
    const { user_id, fullName, phone, address, city, pincode } = body;

    const [result]: any = await connection.query(
      `INSERT INTO delivery_addresses (user_id, full_name, phone, address, city, pincode)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, fullName, phone, address, city, pincode]
    );

    return NextResponse.json({
      success: true,
      message: "Address saved successfully",
      address_id: result.insertId,
    });
  } catch (error: any) {
    console.error("Address Save Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  } finally {
    connection.release();
  }
}
