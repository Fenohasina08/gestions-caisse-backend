import { registerSchema } from "./modules/auth/auth.validation.js";

const result = registerSchema.parse({
  email: "bad-email",
  password: "123",
});

console.log(result);