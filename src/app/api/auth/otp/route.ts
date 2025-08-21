import { pool } from "@/lib/database";

export async function POST(req: Request) {
  try {
    const { emailOrPhone, otp } = await req.json();

    // Fetch user by email or phone
    const [rows]: any = await pool.query(
      "SELECT otp, otp_expiry FROM users WHERE email = ? OR phone = ?",
      [emailOrPhone, emailOrPhone]
    );

    if (!rows.length) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const user = rows[0];

    if (user.otp !== otp) {
      return new Response(JSON.stringify({ error: "Invalid OTP" }), { status: 400 });
    }

    if (new Date(user.otp_expiry) < new Date()) {
      return new Response(JSON.stringify({ error: "OTP expired" }), { status: 400 });
    }

    // OTP valid — mark verified
    await pool.query(
      "UPDATE users SET otp = NULL, otp_expiry = NULL, is_verified = 1 WHERE email = ? OR phone = ?",
      [emailOrPhone, emailOrPhone]
    );

    // Optionally, return a token if you want to auto-login
    return new Response(JSON.stringify({ message: "OTP verified successfully", token: "FAKE_TOKEN_FOR_TEST" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "OTP verification failed" }), { status: 500 });
  }
}
