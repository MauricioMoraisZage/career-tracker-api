import request from "supertest";
import { app } from "../../src/app.js";

type TestUserOptions = {
  name?: string;
  email?: string;
  password?: string;
};

export async function createAuthenticatedUser(
  options: TestUserOptions = {},
) {
  const user = {
    name: options.name ?? "Mauricio Test",
    email: options.email ?? "mauricio.integration@test.com",
    password: options.password ?? "test123456",
  };

  const registerResponse = await request(app)
    .post("/auth/register")
    .send(user);

  if (registerResponse.status !== 201) {
    throw new Error(
      `Test user registration failed: ${JSON.stringify(
        registerResponse.body,
      )}`,
    );
  }

  const loginResponse = await request(app)
    .post("/auth/login")
    .send({
      email: user.email,
      password: user.password,
    });

  if (loginResponse.status !== 200) {
    throw new Error(
      `Test user login failed: ${JSON.stringify(loginResponse.body)}`,
    );
  }

  return {
    token: loginResponse.body.token as string,
    user: loginResponse.body.user,
    credentials: user,
  };
}
