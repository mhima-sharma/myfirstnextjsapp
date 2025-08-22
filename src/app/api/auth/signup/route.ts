import { pool } from "@/lib/database";
import bcrypt from "bcrypt";
import { generateOTP, sendOTP } from "@/lib/otp"; // your helpers

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save user with OTP
    await pool.query(
      "INSERT INTO users (name, email, phone, password, otp, otp_expiry) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, phone, hashed, otp, otpExpiry]
    );
    

    // Send OTP email
    await sendOTP(email, otp);

    return new Response(JSON.stringify({ message: "OTP sent to your email" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Registration failed" }), {
      status: 500,
    });
  }
}
