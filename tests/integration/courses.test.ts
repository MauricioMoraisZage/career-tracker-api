import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/app.js";
import { createAuthenticatedUser } from "../helpers/auth.js";

describe("Courses integration tests", () => {
  it("should create and list an authenticated user's course", async () => {
    const { token } = await createAuthenticatedUser();

    const createResponse = await request(app)
      .post("/courses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Backend with Node.js",
        platform: "Career Tracker",
        description: "Practical backend development course.",
        status: "in_progress",
        progress: 30,
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.course).toMatchObject({
      title: "Backend with Node.js",
      status: "IN_PROGRESS",
      progress: 30,
    });

    const listResponse = await request(app)
      .get("/courses")
      .set("Authorization", `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data).toHaveLength(1);
    expect(listResponse.body.pagination.total).toBe(1);
  });

  it("should prevent a user from accessing another user's course", async () => {
    const firstUser = await createAuthenticatedUser({
      email: "first.user@test.com",
    });

    const secondUser = await createAuthenticatedUser({
      email: "second.user@test.com",
    });

    const createResponse = await request(app)
      .post("/courses")
      .set("Authorization", `Bearer ${firstUser.token}`)
      .send({
        title: "Private Backend Course",
        progress: 0,
      });

    const courseId = createResponse.body.course.id;

    const response = await request(app)
      .get(`/courses/${courseId}`)
      .set("Authorization", `Bearer ${secondUser.token}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "error",
      message: "Course not found",
    });
  });

  it("should manage modules inside a user-owned course", async () => {
    const { token } = await createAuthenticatedUser();

    const courseResponse = await request(app)
      .post("/courses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Complete Backend Course",
        status: "in_progress",
        progress: 10,
      });

    const courseId = courseResponse.body.course.id;

    const moduleResponse = await request(app)
      .post(`/courses/${courseId}/modules`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "HTTP and REST",
        description: "Study HTTP methods and status codes.",
        status: "in_progress",
        order: 1,
      });

    expect(moduleResponse.status).toBe(201);

    const moduleId = moduleResponse.body.module.id;

    const updateResponse = await request(app)
      .patch(`/course-modules/${moduleId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "completed",
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.module.status).toBe("COMPLETED");

    const listResponse = await request(app)
      .get(`/courses/${courseId}/modules`)
      .set("Authorization", `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data).toHaveLength(1);

    const deleteResponse = await request(app)
      .delete(`/course-modules/${moduleId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.status).toBe(200);

    const findDeletedResponse = await request(app)
      .get(`/course-modules/${moduleId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(findDeletedResponse.status).toBe(404);
  });
});
