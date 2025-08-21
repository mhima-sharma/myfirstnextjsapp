import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 4000, // TiDB serverless default
  ssl: {
    minVersion: "TLSv1.2", // Enforce TLS 1.2+
    rejectUnauthorized: true, // Verify TiDB cert
  },
});
