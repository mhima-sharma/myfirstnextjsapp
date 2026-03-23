import { NextResponse } from "next/server";
import { pool } from "@/lib/database";

type ProductCountRow = {
  total: number;
};

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) AS total FROM products");
    const result = rows as ProductCountRow[];

    return NextResponse.json({ total: result[0]?.total ?? 0 });
  } catch (error) {
    console.error("Products count API error:", error);
    return NextResponse.json(
      { total: 0, error: "Database error" },
      { status: 500 }
    );
  }
}
