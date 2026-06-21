import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/app.js";

const testUser = {
  name: "Mauricio Test",
  email: "mauricio.integration@test.com",
  password: "test123456",
};

describe("Authentication integration tests", () => {
  it("should register a new user", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(testUser);

    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
      status: "success",
      message: "User registered successfully",
      user: {
        name: testUser.name,
        email: testUser.email,
      },
    });

    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user).not.toHaveProperty("password");
  });

  it("should reject duplicated email", async () => {
    await request(app)
      .post("/auth/register")
      .send(testUser);

    const response = await request(app)
      .post("/auth/register")
      .send(testUser);

    expect(response.status).toBe(409);

    expect(response.body).toEqual({
      status: "error",
      message: "Email is already in use",
    });
  });

  it("should authenticate a registered user", async () => {
    await request(app)
      .post("/auth/register")
      .send(testUser);

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(response.status).toBe(200);

    expect(response.body.status).toBe("success");
    expect(response.body.token).toEqual(expect.any(String));

    expect(response.body.user).toMatchObject({
      name: testUser.name,
      email: testUser.email,
    });

    expect(response.body.user).not.toHaveProperty("password");
  });

  it("should reject an invalid password", async () => {
    await request(app)
      .post("/auth/register")
      .send(testUser);

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: testUser.email,
        password: "wrong-password",
      });

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      status: "error",
      message: "Invalid email or password",
    });
  });

  it("should reject access to profile without token", async () => {
    const response = await request(app)
      .get("/users/me");

    expect(response.status).toBe(401);

    expect(response.body).toEqual({
      status: "error",
      message: "Missing authorization token",
    });
  });

  it("should return the authenticated user profile", async () => {
    await request(app)
      .post("/auth/register")
      .send(testUser);

    const loginResponse = await request(app)
      .post("/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    const token = loginResponse.body.token;

    const response = await request(app)
      .get("/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      status: "success",
      user: {
        name: testUser.name,
        email: testUser.email,
      },
    });

    expect(response.body.user).not.toHaveProperty("password");
  });
});
