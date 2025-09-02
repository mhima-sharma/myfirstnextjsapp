import { NextResponse } from "next/server";
import { pool } from "@/lib/database";

export async function GET() {
  try {
    const [rows] = await pool.query(`
  SELECT 
      o.id AS order_id,
      o.total AS total_amount,
      o.status AS payment_status,
      o.created_at AS order_date,
      
      u.id AS user_id,
      u.name AS user_name,
      u.email AS user_email,
      u.phone AS user_phone,
      
      d.id AS delivery_id,
      d.full_name AS delivery_name,
      d.phone AS delivery_phone,
      d.address AS delivery_address,
      d.city AS delivery_city,
      d.pincode AS delivery_pincode,
      
      p.id AS product_id,
      p.name AS product_name,
      p.description AS product_description,
      p.price AS product_price,
      pi.image_url AS product_image

  FROM orders o
  LEFT JOIN users u ON o.user_id = u.id
  LEFT JOIN delivery_addresses d ON o.delivery_address_id = d.id
  LEFT JOIN products p ON p.id = o.order_id   -- adjust if product stored differently
  LEFT JOIN product_images pi ON pi.id = p.id
  WHERE o.status = 'success'
  ORDER BY o.created_at DESC
`);

  

    return NextResponse.json(Array.isArray(rows) ? rows : []);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json([]);
  }
}
