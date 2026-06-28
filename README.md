# Career Tracker API

[![CI](https://github.com/MauricioMoraisZage/career-tracker-api/actions/workflows/ci.yml/badge.svg)](https://github.com/MauricioMoraisZage/career-tracker-api/actions/workflows/ci.yml)
[![Live API](https://img.shields.io/badge/API-Live-success)](https://career-tracker-api-pxhr.onrender.com/health)
[![Swagger](https://img.shields.io/badge/API-Swagger-85EA2D)](https://career-tracker-api-pxhr.onrender.com/api-docs)

A REST API for managing professional development, courses, learning modules, job opportunities, and job applications.

The project was built with a strong focus on layered architecture, secure authentication, data validation, automated testing, interactive documentation, and full Docker-based execution.

## Live Deployment

- **API:** https://career-tracker-api-pxhr.onrender.com
- **Swagger Documentation:** https://career-tracker-api-pxhr.onrender.com/api-docs
- **API Health:** https://career-tracker-api-pxhr.onrender.com/health
- **Database Health:** https://career-tracker-api-pxhr.onrender.com/db-health

> The free hosting instance may take a short time to respond after a period of inactivity.

## Features

* User registration and authentication with JWT
* Authenticated user profile retrieval
* Complete course management
* Course module management
* Job opportunity management
* Job searching, filtering, and pagination
* Job application management
* Automatic synchronization between applications and job status
* Per-user resource ownership protection
* Data validation with Zod
* Automated integration testing
* Interactive Swagger/OpenAPI documentation
* PostgreSQL and API execution with Docker Compose
* Automatic Prisma migrations on startup

## Technologies

* Node.js
* TypeScript
* Express
* PostgreSQL
* Prisma ORM
* JWT
* bcryptjs
* Zod
* Vitest
* Supertest
* Swagger / OpenAPI
* Docker
* Docker Compose
* pnpm

## Architecture

The API follows a layered architecture:

```text
Request
   ↓
Routes
   ↓
Validation Middleware
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
Prisma ORM
   ↓
PostgreSQL
```

### Layer responsibilities

* **Routes:** define endpoints and middlewares.
* **Validation:** validates request bodies and query parameters.
* **Controllers:** receive HTTP requests and return HTTP responses.
* **Services:** contain business rules.
* **Repositories:** execute database operations.
* **Prisma:** communicates with PostgreSQL.

## Project structure

```text
career-tracker-api/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   ├── docs/
│   ├── errors/
│   ├── generated/
│   ├── lib/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── validations/
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── helpers/
│   ├── integration/
│   └── setup.ts
├── .dockerignore
├── .env.example
├── .env.test.example
├── compose.yaml
├── Dockerfile
├── Makefile
├── package.json
├── pnpm-lock.yaml
├── prisma.config.ts
├── tsconfig.json
└── vitest.config.ts
```

## Main models

```text
User
 ├── Courses
 │    └── Course Modules
 └── Jobs
      └── Application
```

### Important business rules

* Every resource belongs to an authenticated user.
* Users cannot access or modify resources owned by other users.
* A job can have at most one application.
* Creating an application automatically changes the related job status to `APPLIED`.
* Deleting an application resets the related job status to `SAVED`.
* Related operations are executed with Prisma transactions.

## Requirements

For Docker-based execution:

* Docker
* Docker Compose
* Make

For local execution:

* Node.js 22+
* pnpm 11+
* PostgreSQL

## Environment variables

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development

POSTGRES_USER=career_user
POSTGRES_PASSWORD=career_pass
POSTGRES_DB=career_db
POSTGRES_PORT=5432

DATABASE_URL=postgresql://career_user:career_pass@localhost:5432/career_db?schema=public

JWT_SECRET=replace_with_a_secure_random_secret
JWT_EXPIRES_IN=1d
```

Never commit the `.env` file.

An example file is available at:

```text
.env.example
```

## Running with Docker

The recommended way to run the project is with Docker Compose.

### Build and start

```bash
make rebuild
```

Or directly:

```bash
docker compose up --build -d
```

This command:

1. builds the API image;
2. starts PostgreSQL;
3. waits for the database to become healthy;
4. applies Prisma migrations;
5. starts the API.

### Check container status

```bash
make ps
```

Expected:

```text
career_tracker_database   healthy
career_tracker_api        healthy
```

### View logs

```bash
make logs
```

API logs:

```bash
make logs-api
```

Database logs:

```bash
make logs-db
```

### Stop containers

```bash
make down
```

### Remove containers and volume

```bash
make clean
```

> Warning: `make clean` also deletes the PostgreSQL data volume.

## Makefile commands

```text
make help       Show available commands
make up         Start containers
make build      Build Docker images
make rebuild    Rebuild and start containers
make down       Stop containers
make restart    Restart containers
make logs       Show all logs
make logs-api   Show API logs
make logs-db    Show PostgreSQL logs
make ps         Show container status
make test       Run build and tests
make clean      Remove containers, networks, and database volume
```

## Running locally

Install dependencies:

```bash
pnpm install
```

Generate Prisma Client:

```bash
pnpm prisma generate
```

Apply migrations:

```bash
pnpm prisma migrate deploy
```

Start in development mode:

```bash
pnpm dev
```

The API will be available at:

```text
http://localhost:3000
```

## Production build

```bash
pnpm build
pnpm start
```

The TypeScript source code is compiled into the `dist` directory.

## Automated tests

The project includes integration tests for:

* user registration and login;
* JWT authentication;
* protected routes;
* courses;
* course modules;
* jobs;
* searching and filtering;
* pagination;
* resource ownership;
* applications;
* duplicate application prevention;
* transactions;
* automatic job status synchronization.

### Prepare the test database

```bash
pnpm test:migrate
```

### Run tests

```bash
pnpm test
```

### Run in watch mode

```bash
pnpm test:watch
```

### Generate coverage

```bash
pnpm test:coverage
```

## API documentation

Interactive API documentation is available at:

```text
http://localhost:3000/api-docs
```

The OpenAPI JSON specification is available at:

```text
http://localhost:3000/openapi.json
```

Using Swagger UI, you can:

1. register a user;
2. log in;
3. copy the JWT token;
4. click `Authorize`;
5. test protected endpoints.

## Health checks

### API health

```http
GET /health
```

Example response:

```json
{
  "status": "ok",
  "message": "Career Tracker API is running"
}
```

### Database health

```http
GET /db-health
```

Example response:

```json
{
  "status": "ok",
  "database": "connected",
  "usersCount": 0
}
```

## Endpoints

### Authentication

```http
POST /auth/register
POST /auth/login
```

### Users

```http
GET /users/me
```

### Courses

```http
POST   /courses
GET    /courses
GET    /courses/:id
PATCH  /courses/:id
DELETE /courses/:id
```

### Course Modules

```http
POST   /courses/:courseId/modules
GET    /courses/:courseId/modules
GET    /course-modules/:id
PATCH  /course-modules/:id
DELETE /course-modules/:id
```

### Jobs

```http
POST   /jobs
GET    /jobs
GET    /jobs/:id
PATCH  /jobs/:id
DELETE /jobs/:id
```

Filter example:

```http
GET /jobs?status=applied&remote=true&q=backend&page=1&limit=10
```

### Applications

```http
POST   /jobs/:jobId/application
GET    /applications
GET    /applications/:id
PATCH  /applications/:id
DELETE /applications/:id
```

## Available statuses

### Courses and modules

```text
NOT_STARTED
IN_PROGRESS
COMPLETED
```

### Jobs

```text
SAVED
APPLIED
INTERVIEW
REJECTED
OFFER
```

## Security

* Passwords are stored using bcrypt hashes.
* Authentication is based on JWT.
* Private routes are protected by middleware.
* Resource ownership is validated.
* Request data is validated with Zod.
* Sensitive variables are kept outside Git.
* The test database is separate from the main database.
* Password hashes are never exposed in responses.
* Transactions prevent partial updates.

## Checking the database inside Docker

```bash
docker compose exec database \
  psql -U career_user -d career_db -c "\dt"
```

Expected tables:

```text
_prisma_migrations
users
courses
course_modules
jobs
applications
```

## Author

**Mauricio Morais Zage**

Backend Developer focused on Node.js, TypeScript, PostgreSQL, Prisma, REST APIs, automated testing, and Docker.
