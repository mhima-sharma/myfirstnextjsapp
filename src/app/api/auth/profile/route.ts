import { NextResponse } from "next/server";
import { pool } from "@/lib/database";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    // ✅ Get token from headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded: any;

    // ✅ Handle expired or invalid JWT token
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        return NextResponse.json(
          { success: false, message: "Session expired, please log in again" },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // ✅ Fetch user details from DB
    const [rows]: any = await pool.query(
      "SELECT id, name, email, phone, created_at FROM users WHERE id = ?",
      [decoded.id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Add a static avatar image
    const user = {
      ...rows[0],
      profile_image: "/profile.png", // Place profile.png in /public
    };

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error: any) {
    console.error("Profile API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
