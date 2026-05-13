import "dotenv/config";
import { z } from "zod";

const env = z
  .object({
    PORT: z.coerce.number().default(3001),
    DATABASE_URL: z.string(),

    JWT_ACCESS_SECRET: z.string().default(process.env.JWT_SECRET || ""),
    JWT_REFRESH_SECRET: z.string(),

    JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
    JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

    RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
    RATE_LIMIT_MAX: z.coerce.number().default(10),

    ARGON2_TIME_COST: z.coerce.number().optional(),
    ARGON2_MEMORY_COST: z.coerce.number().optional(),
    ARGON2_PARALLELISM: z.coerce.number().optional(),
  })
  .parse(process.env);

export { env };