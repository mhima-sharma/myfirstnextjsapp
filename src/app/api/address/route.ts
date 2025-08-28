import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/database";

// ✅ Middleware to verify JWT and get userId
function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded.id;
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new Error("TokenExpired");
    }
    throw new Error("InvalidToken");
  }
}

// ✅ POST: Save a new delivery address
export async function POST(req: NextRequest) {
  try {
    const userId = verifyToken(req);
    const body = await req.json();
    const { fullName, phone, address, city, pincode } = body;

    // Validation
    if (!fullName || !phone || !address || !city || !pincode) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Insert address into DB
    await pool.query(
      `INSERT INTO delivery_addresses 
      (user_id, full_name, phone, address, city, pincode) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, fullName, phone, address, city, pincode]
    );

    return NextResponse.json({
      success: true,
      message: "Address saved successfully",
    });
  } catch (error: any) {
    console.error("POST /api/address error:", error);
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    if (error.message === "TokenExpired") {
      return NextResponse.json(
        { success: false, message: "Token expired" },
        { status: 401 }
      );
    }
    if (error.message === "InvalidToken") {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// ✅ GET: Fetch user's saved delivery addresses
export async function GET(req: NextRequest) {
  try {
    const userId = verifyToken(req);

    // Check if the user has saved addresses
    const [rows]: any = await pool.query(
      "SELECT * FROM delivery_addresses WHERE user_id = ? ORDER BY id DESC",
      [userId]
    );

    // ✅ If no address, insert a dummy one automatically
    if (rows.length === 0) {
      const dummy = {
        fullName: "John Doe",
        phone: "9876543210",
        address: "123, Green Street, Plant City",
        city: "Mumbai",
        pincode: "400001",
      };

      await pool.query(
        `INSERT INTO delivery_addresses 
        (user_id, full_name, phone, address, city, pincode)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, dummy.fullName, dummy.phone, dummy.address, dummy.city, dummy.pincode]
      );

      // Fetch the newly inserted dummy address
      const [newRows]: any = await pool.query(
        "SELECT * FROM delivery_addresses WHERE user_id = ? ORDER BY id DESC",
        [userId]
      );

      return NextResponse.json({ success: true, addresses: newRows });
    }

    // ✅ Return existing addresses
    return NextResponse.json({ success: true, addresses: rows });
  } catch (error: any) {
    console.error("GET /api/address error:", error);
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    if (error.message === "TokenExpired") {
      return NextResponse.json(
        { success: false, message: "Token expired" },
        { status: 401 }
      );
    }
    if (error.message === "InvalidToken") {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
