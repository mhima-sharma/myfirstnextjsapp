// import mysql from "mysql2/promise";
// import { NextResponse } from "next/server";

// // ✅ DB connection pool
// const db = await mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// // GET /api/products/[id]
// export async function GET(req, { params }) {
//   const { id } = params; // ID from URL: /api/products/123 -> id = "123"

//   if (!id) {
//     return NextResponse.json({ success: false, message: "Product ID missing" }, { status: 400 });
//   }

//   try {
//     const [products] = await db.query(
//       `SELECT 
//         p.id,
//         p.name,
//         p.description,
//         p.price,
//         ANY_VALUE(c.name) AS category,
//         GROUP_CONCAT(i.image_url) AS images
//       FROM products p
//       LEFT JOIN categories c ON p.category_id = c.id
//       LEFT JOIN product_images i ON p.id = i.product_id
//       WHERE p.id = ?
//       GROUP BY p.id`,
//       [id]
//     );

//     if ((products ).length === 0) {
//       return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
//     }

//     // Convert images string to array before sending
//     const product = (products )[0];
//     product.images = product.images ? product.images.split(",") : [];

//     return NextResponse.json({ success: true, product });
//   } catch (error) {
//     console.error("❌ Error fetching product by ID:", error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }
import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

// ✅ DB connection pool
const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

// GET /api/products/[id]
export async function GET(req, context ) {
  try {
    // ✅ Await params
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID missing" },
        { status: 400 }
      );
    }

    const [products] = await db.query(
      `SELECT 
        p.id,
        p.name,
        p.description,
        p.quantity, 
        p.price,
        ANY_VALUE(c.name) AS category,
        GROUP_CONCAT(i.image_url) AS images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images i ON p.id = i.product_id
      WHERE p.id = ?
      GROUP BY p.id`,
      [id]
    );

    if ((products ).length === 0) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Convert images string to array
    const product = (products )[0];
    product.images = product.images ? product.images.split(",") : [];

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("❌ Error fetching product by ID:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
