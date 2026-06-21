import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/app.js";
import { createAuthenticatedUser } from "../helpers/auth.js";

async function createTestJob(token: string) {
  const response = await request(app)
    .post("/jobs")
    .set("Authorization", `Bearer ${token}`)
    .send({
      company: "Application Test Company",
      position: "Backend Developer",
      remote: true,
      status: "saved",
    });

  return response.body.job;
}

describe("Applications integration tests", () => {
  it("should create an application and mark the job as applied", async () => {
    const { token } = await createAuthenticatedUser();
    const job = await createTestJob(token);

    const response = await request(app)
      .post(`/jobs/${job.id}/application`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        cvVersion: "Backend CV v2",
        coverLetter:
          "Application focused on my backend development experience.",
        notes: "Applied through the company website.",
      });

    expect(response.status).toBe(201);
    expect(response.body.application.job.status).toBe("APPLIED");

    const jobResponse = await request(app)
      .get(`/jobs/${job.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(jobResponse.body.job.status).toBe("APPLIED");
    expect(jobResponse.body.job.appliedAt).not.toBeNull();
  });

  it("should reject a duplicated application for the same job", async () => {
    const { token } = await createAuthenticatedUser();
    const job = await createTestJob(token);

    await request(app)
      .post(`/jobs/${job.id}/application`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        cvVersion: "Backend CV",
      });

    const response = await request(app)
      .post(`/jobs/${job.id}/application`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        cvVersion: "Another CV",
      });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      status: "error",
      message: "Application already exists for this job",
    });
  });

  it("should list, update and delete an application", async () => {
    const { token } = await createAuthenticatedUser();
    const job = await createTestJob(token);

    const createResponse = await request(app)
      .post(`/jobs/${job.id}/application`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        cvVersion: "Backend CV v1",
        notes: "Initial application.",
      });

    const applicationId =
      createResponse.body.application.id;

    const listResponse = await request(app)
      .get("/applications?page=1&limit=10")
      .set("Authorization", `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data).toHaveLength(1);
    expect(listResponse.body.pagination.total).toBe(1);

    const updateResponse = await request(app)
      .patch(`/applications/${applicationId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        cvVersion: "Backend CV v2",
        notes: "Recruiter confirmed receipt.",
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.application.cvVersion).toBe(
      "Backend CV v2",
    );

    const deleteResponse = await request(app)
      .delete(`/applications/${applicationId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);

    const jobResponse = await request(app)
      .get(`/jobs/${job.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(jobResponse.body.job.status).toBe("SAVED");
    expect(jobResponse.body.job.appliedAt).toBeNull();
  });
});
