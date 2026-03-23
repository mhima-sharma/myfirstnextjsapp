import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 4000,
  ssl: {
    minVersion: "TLSv1.2", // Enforce TLS 1.2+
    rejectUnauthorized: true, // Verify TiDB cert
  },
});
