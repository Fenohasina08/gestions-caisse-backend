import { register, login } from "./src/modules/auth/auth.service.js";

async function test() {
  try {
    // 1. REGISTER TEST
    const res = await register({
      email: "test@example.com",
      password: "password123",
      phone: "0341234567",
    });

    console.log("REGISTER OK:", res);

    // 2. LOGIN TEST
    const loginRes = await login({
      email: "test@example.com",
      password: "password123",
    });

    console.log("LOGIN OK:", loginRes);
  } catch (err) {
    console.error("ERROR:", err);
  }
}

test();