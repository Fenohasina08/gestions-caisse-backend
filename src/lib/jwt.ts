import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface TokenPayload {
  sub: number;
}

export function generateAccessToken(userId: number) {
  return jwt.sign(
    { sub: userId },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    }
  );
}

export function generateRefreshToken(userId: number) {
  return jwt.sign(
    { sub: userId },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    }
  );
}

export function verifyAccessToken(token: string) {
  return jwt.verify(
    token,
    env.JWT_ACCESS_SECRET
  ) as TokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(
    token,
    env.JWT_REFRESH_SECRET
  ) as TokenPayload;
}