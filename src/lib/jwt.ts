import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

type TokenPayload = {
  sub: number;
};

const accessTokenSecret: Secret = env.JWT_ACCESS_SECRET;
const refreshTokenSecret: Secret = env.JWT_REFRESH_SECRET;

const accessTokenOptions: SignOptions = {
  expiresIn: "15m",
};

const refreshTokenOptions: SignOptions = {
  expiresIn: "7d",
};

export function generateAccessToken(userId: number) {
  return jwt.sign(
    { sub: userId },
    accessTokenSecret,
    accessTokenOptions
  );
}

export function generateRefreshToken(userId: number) {
  return jwt.sign(
    { sub: userId },
    refreshTokenSecret,
    refreshTokenOptions
  );
}

export function verifyAccessToken(token: string) {
  return jwt.verify(
    token,
    accessTokenSecret
  ) as unknown as TokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(
    token,
    refreshTokenSecret
  ) as unknown as TokenPayload;
}