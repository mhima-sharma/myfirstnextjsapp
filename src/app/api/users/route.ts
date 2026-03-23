import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { pool } from "@/lib/database";

type JwtPayload = {
  id: number;
  email?: string;
};

type UserRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret123"
    ) as JwtPayload;

    const [rows] = await pool.query(
      "SELECT id, name, email, phone FROM users WHERE id = ?",
      [decoded.id]
    );

    const users = rows as UserRow[];

    return NextResponse.json(users);
  } catch (error) {
    console.error("Users API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
