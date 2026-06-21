import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/app.js";
import { createAuthenticatedUser } from "../helpers/auth.js";

describe("Jobs integration tests", () => {
  it("should create, list and filter jobs", async () => {
    const { token } = await createAuthenticatedUser();

    await request(app)
      .post("/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        company: "Flora Energia",
        position: "Backend Developer",
        location: "Remote",
        remote: true,
        status: "applied",
        description: "Node.js and TypeScript backend position.",
      });

    await request(app)
      .post("/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        company: "Local Company",
        position: "Java Developer",
        location: "Luanda",
        remote: false,
        status: "saved",
      });

    const response = await request(app)
      .get(
        "/jobs?status=applied&remote=true&q=backend&page=1&limit=10",
      )
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);

    expect(response.body.data[0]).toMatchObject({
      company: "Flora Energia",
      position: "Backend Developer",
      remote: true,
      status: "APPLIED",
    });

    expect(response.body.pagination).toMatchObject({
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    });
  });

  it("should update and delete a user-owned job", async () => {
    const { token } = await createAuthenticatedUser();

    const createResponse = await request(app)
      .post("/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        company: "Remote Company",
        position: "Node.js Developer",
        remote: true,
        status: "saved",
      });

    const jobId = createResponse.body.job.id;

    const updateResponse = await request(app)
      .patch(`/jobs/${jobId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "interview",
        description: "Technical interview scheduled.",
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.job.status).toBe("INTERVIEW");

    const deleteResponse = await request(app)
      .delete(`/jobs/${jobId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);

    const findResponse = await request(app)
      .get(`/jobs/${jobId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(findResponse.status).toBe(404);
  });

  it("should prevent access to another user's job", async () => {
    const owner = await createAuthenticatedUser({
      email: "job.owner@test.com",
    });

    const otherUser = await createAuthenticatedUser({
      email: "job.other@test.com",
    });

    const createResponse = await request(app)
      .post("/jobs")
      .set("Authorization", `Bearer ${owner.token}`)
      .send({
        company: "Private Company",
        position: "Backend Engineer",
        remote: true,
      });

    const jobId = createResponse.body.job.id;

    const response = await request(app)
      .get(`/jobs/${jobId}`)
      .set("Authorization", `Bearer ${otherUser.token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Job not found");
  });
});
