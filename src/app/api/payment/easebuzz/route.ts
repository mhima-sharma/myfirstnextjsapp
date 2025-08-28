import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { pool } from "@/lib/database";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, userId, name, email, phone } = body;

    const txnid = "EBZ" + Date.now();
    const key = process.env.EASEBUZZ_KEY!;
    const salt = process.env.EASEBUZZ_SALT!;
    const productinfo = "Purchase from Next.js Store";

    // ✅ Generate Hash
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${name}|${email}|||||||||||${salt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    // ✅ Insert pending payment in DB
    await pool.query(
      "INSERT INTO payments (user_id, order_id, gateway, amount, status) VALUES (?, ?, ?, ?, ?)",
      [userId, txnid, "easebuzz", amount, "pending"]
    );

    // ✅ Generate Payment Link
    const url = "https://pay.easebuzz.in/payment/initiateLink";
    const formData = new URLSearchParams({
      key,
      txnid,
      amount,
      productinfo,
      firstname: name,
      email,
      phone,
      surl: `${process.env.NEXT_PUBLIC_API_URL}/payment/webhook`,
      furl: `${process.env.NEXT_PUBLIC_API_URL}/payment/webhook`,
      hash,
    });

    const { data } = await axios.post(url, formData.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
