// app/api/auth/login-otp/route.ts
import { pool } from "@/lib/database";
import { generateOTP, sendOTP } from "@/lib/otp"; // your OTP helpers

export async function POST(req: Request) {
  try {
    const { emailOrPhone } = await req.json();

    const [rows]: any = await pool.query(
      "SELECT * FROM users WHERE email = ? OR phone = ?",
      [emailOrPhone, emailOrPhone]
    );

    if (!rows.length) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await pool.query(
      "UPDATE users SET otp = ?, otp_expiry = ? WHERE email = ? OR phone = ?",
      [otp, otpExpiry, emailOrPhone, emailOrPhone]
    );

    await sendOTP(emailOrPhone, otp);

    return new Response(JSON.stringify({ message: "OTP sent" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to send OTP" }), { status: 500 });
  }
}
