import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/app.js";

function restoreEnv(
  name: string,
  previousValue: string | undefined,
) {
  if (previousValue === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = previousValue;
}

describe("Security middleware integration tests", () => {
  it("should return security headers", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBe("SAMEORIGIN");
    expect(response.headers["referrer-policy"]).toBe("no-referrer");
    expect(response.headers["strict-transport-security"]).toContain(
      "max-age=",
    );
  });

  it("should generate a request id", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.headers["x-request-id"]).toEqual(expect.any(String));
    expect(response.headers["x-request-id"].length).toBeGreaterThan(0);
  });

  it("should preserve a caller-provided request id", async () => {
    const requestId = "career-tracker-test-request-id";

    const response = await request(app)
      .get("/health")
      .set("X-Request-Id", requestId);

    expect(response.status).toBe(200);
    expect(response.headers["x-request-id"]).toBe(requestId);
  });

  it("should expose CORS headers for an allowed origin", async () => {
    const previousCorsOrigins = process.env.CORS_ORIGINS;
    const origin = "https://allowed.example.com";

    process.env.CORS_ORIGINS = origin;

    try {
      const response = await request(app)
        .get("/health")
        .set("Origin", origin);

      expect(response.status).toBe(200);
      expect(response.headers["access-control-allow-origin"]).toBe(origin);
      expect(response.headers["vary"]).toContain("Origin");
    } finally {
      restoreEnv("CORS_ORIGINS", previousCorsOrigins);
    }
  });

  it("should not expose CORS headers for a blocked origin", async () => {
    const previousCorsOrigins = process.env.CORS_ORIGINS;

    process.env.CORS_ORIGINS = "https://allowed.example.com";

    try {
      const response = await request(app)
        .get("/health")
        .set("Origin", "https://blocked.example.com");

      expect(response.status).toBe(200);
      expect(
        response.headers["access-control-allow-origin"],
      ).toBeUndefined();
    } finally {
      restoreEnv("CORS_ORIGINS", previousCorsOrigins);
    }
  });

  it("should rate-limit repeated authentication attempts outside test mode", async () => {
    const previousNodeEnv = process.env.NODE_ENV;

    process.env.NODE_ENV = "production";

    try {
      for (let attempt = 0; attempt < 20; attempt += 1) {
        const response = await request(app)
          .post("/auth/login")
          .send({});

        expect(response.status).not.toBe(429);
      }

      const blockedResponse = await request(app)
        .post("/auth/login")
        .send({});

      expect(blockedResponse.status).toBe(429);
      expect(blockedResponse.body).toEqual({
        status: "error",
        message:
          "Too many authentication attempts. Please try again later.",
      });
    } finally {
      restoreEnv("NODE_ENV", previousNodeEnv);
    }
  });
});
