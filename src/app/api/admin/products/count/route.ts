// import { NextResponse } from "next/server";
// import mysql from "mysql2/promise";

// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   port: Number(process.env.DB_PORT) || 3306,
// });

// export async function GET() {
//   try {
//     const [rows] = await db.query("SELECT COUNT(*) AS total FROM products");
    
//     // rows might be typed as 'any[]', so explicitly cast:
//     const result = rows as { total: number }[];

//     const total = result[0]?.total ?? 0; // fallback to 0 if undefined
//     return NextResponse.json({ total });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ total: 0, error: "Database error" }, { status: 500 });
//   }
// }
