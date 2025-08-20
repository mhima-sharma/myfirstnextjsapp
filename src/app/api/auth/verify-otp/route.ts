import { pool } from "@/lib/database";
import { generateToken } from "@/lib/auth"; // your JWT function

export async function POST(req: Request) {
  try {
    const { emailOrPhone, otp } = await req.json();

    // Fetch user by email or phone
    const [rows]: any = await pool.query(
      "SELECT * FROM users WHERE email = ? OR phone = ?",
      [emailOrPhone, emailOrPhone]
    );

    if (!rows.length) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const user = rows[0];

    // Check OTP
    if (user.otp !== otp) {
      return new Response(JSON.stringify({ error: "Invalid OTP" }), { status: 400 });
    }

    // Check expiry
    if (new Date(user.otp_expiry) < new Date()) {
      return new Response(JSON.stringify({ error: "OTP expired" }), { status: 400 });
    }

    // OTP is valid — clear OTP and mark verified
    await pool.query(
      "UPDATE users SET otp = NULL, otp_expiry = NULL, is_verified = 1 WHERE email = ? OR phone = ?",
      [emailOrPhone, emailOrPhone]
    );

    // Generate JWT token for login
    const token = generateToken({ id: user.id, email: user.email });

    return new Response(
      JSON.stringify({ message: "OTP verified successfully", token }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "OTP verification failed" }),
      { status: 500 }
    );
  }
}
