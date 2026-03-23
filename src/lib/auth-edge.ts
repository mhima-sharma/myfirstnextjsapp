import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export const verifyEdgeToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch {
    return null;
  }
};
