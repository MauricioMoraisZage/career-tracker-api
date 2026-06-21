# Career Tracker API

A production-oriented REST API for managing professional learning, saved job opportunities and job application workflows.

The Career Tracker API helps users organize courses, track course modules, save job opportunities and manage applications through a secure and documented backend system.

## Project Status

The main API features are complete:

* Authentication with JWT
* Course management
* Course module management
* Job opportunity management
* Job application workflow
* Automated integration tests
* Swagger/OpenAPI documentation
* Docker configuration for the API, PostgreSQL and Prisma migrations

The remaining release steps are Docker runtime validation and production deployment.

---

## Main Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Password hashing
* Protected routes
* Authenticated user profile

### Courses

* Create courses
* List user-owned courses
* Search and filter courses
* Update course progress and status
* Delete courses
* Pagination support

### Course Modules

* Create modules inside courses
* List modules in a defined order
* Update module progress status
* Delete course modules
* Ownership validation through the related course

### Jobs

* Save job opportunities
* Search by company, position or location
* Filter by status and remote work
* Update application progress
* Delete job opportunities
* Pagination support

### Applications

* Create one application per job
* Save CV version, cover letter and notes
* Prevent duplicate applications
* Automatically update the related job to `APPLIED`
* Reset the job to `SAVED` when an application is deleted
* Keep job and application dates synchronized
* Execute related changes through database transactions

### Quality and Documentation

* Integration tests with Vitest and Supertest
* Dedicated PostgreSQL test database
* Swagger UI
* OpenAPI specification
* Docker multi-stage build
* Database and API health checks
* Automatic Prisma migration service

---

## Technology Stack

* Node.js
* TypeScript
* Express 5
* PostgreSQL 16
* Prisma ORM 7
* Zod
* JSON Web Token
* bcryptjs
* Vitest
* Supertest
* Swagger UI
* OpenAPI 3
* Docker
* Docker Compose
* pnpm

---

## Architecture

The project follows a layered architecture:

```text
HTTP Request
     │
     ▼
Route
     │
     ▼
Validation Middleware
     │
     ▼
Controller
     │
     ▼
Service
     │
     ▼
Repository
     │
     ▼
Prisma ORM
     │
     ▼
PostgreSQL
```

### Responsibilities

* **Routes:** Define API endpoints and attach middleware.
* **Validation:** Validate and transform external input with Zod.
* **Controllers:** Handle HTTP requests and responses.
* **Services:** Apply business rules and authorization checks.
* **Repositories:** Execute database queries.
* **Prisma:** Maps application entities to PostgreSQL tables.
* **Error middleware:** Produces consistent API error responses.

---

## Data Model

```text
User
├── Courses
│   └── Course Modules
└── Jobs
    └── Application
```

### Main Relationships

* A user can own multiple courses.
* A course can contain multiple modules.
* A user can save multiple job opportunities.
* A job can have zero or one application.
* Deleting a user removes their related resources.
* Deleting a course removes its modules.
* Deleting a job removes its application.

---

## Project Structure

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
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── pnpm-lock.yaml
├── prisma.config.ts
├── tsconfig.json
└── vitest.config.ts
```

---

## Requirements

For local development:

* Node.js 24 or newer
* pnpm
* Docker
* Docker Compose

Check the installed versions:

```bash
node --version
pnpm --version
docker --version
docker compose version
```

---

## Environment Variables

Create a local environment file:

```bash
cp .env.example .env
```

Example configuration:

```env
NODE_ENV=development
PORT=3000

DATABASE_URL="postgresql://career_user:career_password@localhost:5432/career_tracker_db?schema=public"

JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=1h

POSTGRES_USER=career_user
POSTGRES_PASSWORD=career_password
POSTGRES_DB=career_tracker_db
```

Do not commit the `.env` file.

---

## Local Installation

Clone the repository:

```bash
git clone git@github.com:MauricioMoraisZage/career-tracker-api.git
cd career-tracker-api
```

Install dependencies:

```bash
pnpm install
```

Start only PostgreSQL:

```bash
docker compose up -d database
```

Generate the Prisma Client:

```bash
pnpm prisma generate
```

Apply the existing migrations:

```bash
pnpm prisma migrate deploy
```

Start the development server:

```bash
pnpm dev
```

The API will be available at:

```text
http://localhost:3000
```

---

## Development Commands

Start the development server:

```bash
pnpm dev
```

Build the TypeScript project:

```bash
pnpm build
```

Start the compiled application:

```bash
pnpm start
```

Generate the Prisma Client:

```bash
pnpm prisma generate
```

Create a development migration:

```bash
pnpm prisma migrate dev --name migration_name
```

Apply committed migrations:

```bash
pnpm prisma migrate deploy
```

---

## Running with Docker

The Docker environment contains three services:

```text
database
migrator
api
```

* `database` runs PostgreSQL.
* `migrator` applies Prisma migrations and exits.
* `api` runs the compiled production application.

Build and start the complete environment:

```bash
docker compose up --build
```

Start in detached mode:

```bash
docker compose up -d --build
```

Check service status:

```bash
docker compose ps
```

View API logs:

```bash
docker compose logs -f api
```

View migration logs:

```bash
docker compose logs migrator
```

Stop the environment:

```bash
docker compose down
```

Do not use the following command unless you intentionally want to delete the PostgreSQL volume:

```bash
docker compose down -v
```

---

## API Documentation

Swagger UI is available at:

```text
http://localhost:3000/api-docs
```

The raw OpenAPI specification is available at:

```text
http://localhost:3000/openapi.json
```

Swagger UI supports:

* Endpoint exploration
* Request body examples
* Query and path parameters
* Response schemas
* JWT Bearer authentication
* Interactive API requests

### Using JWT in Swagger

1. Execute `POST /auth/login`.
2. Copy the returned token.
3. Click **Authorize**.
4. Paste only the token.
5. Confirm authorization.
6. Execute protected endpoints.

---

## Health Checks

Check the API:

```bash
curl http://localhost:3000/health
```

Check the database connection:

```bash
curl http://localhost:3000/db-health
```

---

## API Endpoints

### Health

| Method | Endpoint     | Description                 |
| ------ | ------------ | --------------------------- |
| GET    | `/health`    | Check API health            |
| GET    | `/db-health` | Check database connectivity |

### Authentication

| Method | Endpoint         | Description                    |
| ------ | ---------------- | ------------------------------ |
| POST   | `/auth/register` | Register a user                |
| POST   | `/auth/login`    | Authenticate and receive a JWT |

### Users

| Method | Endpoint    | Description                   |
| ------ | ----------- | ----------------------------- |
| GET    | `/users/me` | Return the authenticated user |

### Courses

| Method | Endpoint       | Description             |
| ------ | -------------- | ----------------------- |
| POST   | `/courses`     | Create a course         |
| GET    | `/courses`     | List user-owned courses |
| GET    | `/courses/:id` | Return one course       |
| PATCH  | `/courses/:id` | Update a course         |
| DELETE | `/courses/:id` | Delete a course         |

### Course Modules

| Method | Endpoint                     | Description              |
| ------ | ---------------------------- | ------------------------ |
| POST   | `/courses/:courseId/modules` | Create a course module   |
| GET    | `/courses/:courseId/modules` | List course modules      |
| GET    | `/course-modules/:id`        | Return one course module |
| PATCH  | `/course-modules/:id`        | Update a course module   |
| DELETE | `/course-modules/:id`        | Delete a course module   |

### Jobs

| Method | Endpoint    | Description              |
| ------ | ----------- | ------------------------ |
| POST   | `/jobs`     | Create a job opportunity |
| GET    | `/jobs`     | List job opportunities   |
| GET    | `/jobs/:id` | Return one job           |
| PATCH  | `/jobs/:id` | Update a job             |
| DELETE | `/jobs/:id` | Delete a job             |

### Applications

| Method | Endpoint                   | Description                     |
| ------ | -------------------------- | ------------------------------- |
| POST   | `/jobs/:jobId/application` | Create an application for a job |
| GET    | `/applications`            | List applications               |
| GET    | `/applications/:id`        | Return one application          |
| PATCH  | `/applications/:id`        | Update an application           |
| DELETE | `/applications/:id`        | Delete an application           |

---

## Query Parameters

### Courses

```http
GET /courses?status=in_progress&q=backend&page=1&limit=10
```

Supported parameters:

| Parameter | Type    | Description               |
| --------- | ------- | ------------------------- |
| `status`  | string  | Filter by course status   |
| `q`       | string  | Search course information |
| `page`    | integer | Page number               |
| `limit`   | integer | Results per page          |

Course statuses:

```text
not_started
in_progress
completed
```

### Jobs

```http
GET /jobs?status=applied&remote=true&q=backend&page=1&limit=10
```

Supported parameters:

| Parameter | Type    | Description                          |
| --------- | ------- | ------------------------------------ |
| `status`  | string  | Filter by job status                 |
| `remote`  | boolean | Filter remote opportunities          |
| `q`       | string  | Search company, position or location |
| `page`    | integer | Page number                          |
| `limit`   | integer | Results per page                     |

Job statuses:

```text
saved
applied
interview
rejected
offer
```

### Applications

```http
GET /applications?page=1&limit=10
```

---

## Authentication Example

Register a user:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mauricio Morais",
    "email": "mauricio@example.com",
    "password": "strong-password"
  }'
```

Login:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mauricio@example.com",
    "password": "strong-password"
  }'
```

Use the returned token:

```bash
curl http://localhost:3000/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Automated Tests

The project uses:

* Vitest as the test runner
* Supertest for HTTP integration tests
* A dedicated PostgreSQL test database
* Automatic database cleanup between tests

### Test Environment

Create the test environment file:

```bash
cp .env.test.example .env.test
```

Example:

```env
NODE_ENV=test
PORT=3001

DATABASE_URL="postgresql://career_user:career_password@localhost:5432/career_tracker_test_db?schema=public"

JWT_SECRET=career_tracker_test_secret
JWT_EXPIRES_IN=1h
```

Create the test database:

```bash
docker exec career_tracker_database \
  psql -U career_user -d postgres \
  -c "CREATE DATABASE career_tracker_test_db;"
```

Apply migrations:

```bash
pnpm test:migrate
```

Run all tests:

```bash
pnpm test
```

Run in watch mode:

```bash
pnpm test:watch
```

Generate a coverage report:

```bash
pnpm test:coverage
```

### Covered Scenarios

* User registration
* Duplicate email rejection
* Login
* Invalid credentials
* Protected route access
* Course CRUD
* Course ownership
* Course module lifecycle
* Job CRUD
* Job searching and filtering
* Pagination
* Application creation
* Duplicate application prevention
* Transactional job status synchronization
* Application deletion
* Cross-user resource protection

---

## Validation and Error Handling

Incoming data is validated with Zod.

Example validation error:

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

Example resource error:

```json
{
  "status": "error",
  "message": "Job not found"
}
```

The API uses standard HTTP status codes:

| Status | Meaning                            |
| ------ | ---------------------------------- |
| `200`  | Successful request                 |
| `201`  | Resource created                   |
| `400`  | Invalid request data               |
| `401`  | Authentication required or invalid |
| `404`  | Resource not found                 |
| `409`  | Resource conflict                  |
| `500`  | Internal server error              |

---

## Security Decisions

* Passwords are hashed before storage.
* JWT is required for protected endpoints.
* Secrets are loaded through environment variables.
* Users can only access their own resources.
* Ownership is validated in the service and repository layers.
* Validation occurs before business logic.
* Password fields are not returned in API responses.
* Test data is isolated from development data.
* Docker images exclude environment files.
* Application and job updates use database transactions where consistency is required.

---

## Important Business Rules

### Resource Ownership

A user cannot access courses, modules, jobs or applications owned by another user.

For protected resources, unauthorized ownership access returns `404` instead of exposing whether the resource exists.

### Course Modules

Course modules are always accessed through a course owned by the authenticated user.

### Applications

A job can have at most one application.

Creating an application:

```text
Application created
        +
Job status changed to APPLIED
```

Deleting an application:

```text
Application deleted
        +
Job status changed to SAVED
        +
Job appliedAt cleared
```

These related operations use Prisma transactions.

---

## Future Improvements

* Production deployment
* Continuous integration with GitHub Actions
* Refresh tokens
* Email verification
* Password recovery
* Job interview scheduling
* Application activity history
* Career analytics dashboard
* Notification system
* Rate limiting
* Structured application logging
* API versioning

---

## Author

**Mauricio Morais Zage**

Backend Developer focused on Node.js, TypeScript, PostgreSQL, Prisma, Express and Docker.

GitHub:

```text
https://github.com/MauricioMoraisZage
```

---

## Portfolio Purpose

This project was developed to demonstrate practical backend engineering skills, including:

* REST API design
* Authentication and authorization
* Relational database modeling
* Layered backend architecture
* Input validation
* Business rule implementation
* Transaction management
* Automated integration testing
* API documentation
* Containerization
* Production-oriented project organization
