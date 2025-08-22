import { pool } from "@/lib/database";
import { generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { emailOrPhone, otp } = await req.json();

    const [rows]: any = await pool.query(
      "SELECT * FROM users WHERE email = ? OR phone = ?",
      [emailOrPhone, emailOrPhone]
    );

    if (!rows.length) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const user = rows[0];

    if ((user.otp ?? "").toString() !== otp.toString()) {
      return new Response(JSON.stringify({ error: "Invalid OTP" }), { status: 400 });
    }

    if (user.otp_expiry && new Date(user.otp_expiry) < new Date()) {
      return new Response(JSON.stringify({ error: "OTP expired" }), { status: 400 });
    }

    await pool.query(
      "UPDATE users SET otp = NULL, otp_expiry = NULL, is_verified = 1 WHERE id = ?",
      [user.id]
    );

    // Generate token
    const token = generateToken({ id: user.id, email: user.email });

    
    (await
      cookies()).set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      // maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return new Response(JSON.stringify({ message: "OTP verified successfully",token:token }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "OTP verification failed" }), {
      status: 500,
    });
  }
}
