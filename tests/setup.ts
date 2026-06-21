import { afterAll, beforeAll, beforeEach } from "vitest";
import { prisma } from "../src/lib/prisma.js";

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
