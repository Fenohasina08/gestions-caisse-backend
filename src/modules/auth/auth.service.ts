import argon2 from "argon2";
import prisma from "../../lib/prisma.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../lib/jwt.js";
import { env } from "../../config/env.js";
import { RegisterDto, LoginDto } from "./auth.validation.js";

const selectUser = {
  id: true,
  email: true,
  phone: true,
  created_at: true,
};

function throwError(status: number, message: string): never {
  throw { status, message };
}

export async function register(dto: RegisterDto) {
  const existing = await prisma.user.findUnique({
    where: { email: dto.email },
  });

  if (existing) throwError(409, "Email already exists");

  const hashedPassword = await argon2.hash(dto.password, {
    timeCost: env.ARGON2_TIME_COST ?? 3,
    memoryCost: env.ARGON2_MEMORY_COST ?? 4096,
    parallelism: env.ARGON2_PARALLELISM ?? 1,
  });

  const user = await prisma.user.create({
    data: {
      email: dto.email,
      password_hash: hashedPassword,
      phone: dto.phone ?? null,
    },
    select: selectUser,
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { user, accessToken, refreshToken };
}

export async function login(dto: LoginDto) {
  const user = await prisma.user.findUnique({
    where: { email: dto.email },
  });

  if (!user) throwError(401, "Invalid credentials");

  const isValid = await argon2.verify(user.password_hash, dto.password);

  if (!isValid) throwError(401, "Invalid credentials");

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      phone: user.phone,
    },
    accessToken,
    refreshToken,
  };
}

export async function refreshAccessToken(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: selectUser,
  });

  if (!user) throwError(401, "User not found");

  const newAccessToken = generateAccessToken(user.id);

  return { accessToken: newAccessToken };
}

export async function getProfile(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: selectUser,
  });
}