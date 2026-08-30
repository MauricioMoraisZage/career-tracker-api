import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Career Tracker API",
      version: "1.0.0",
      description:
        "REST API for managing professional courses, learning modules, job opportunities and job applications.",
    },

    servers: [
      {
        url: "/",
        description: "Current API server",
      },
    ],

    tags: [
      {
        name: "Health",
        description: "API and database health checks",
      },
      {
        name: "Authentication",
        description: "User registration and authentication",
      },
      {
        name: "Users",
        description: "Authenticated user information",
      },
      {
        name: "Courses",
        description: "Professional course management",
      },
      {
        name: "Course Modules",
        description: "Learning modules associated with courses",
      },
      {
        name: "Jobs",
        description: "Job opportunity management",
      },
      {
        name: "Applications",
        description: "Job application management",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "ae774c72-cf90-45dc-a4fa-68f30d914525",
            },
            name: {
              type: "string",
              example: "Mauricio Morais",
            },
            email: {
              type: "string",
              format: "email",
              example: "molde@test.com",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        ErrorResponse: {
          type: "object",
          required: ["status", "message"],
          properties: {
            status: {
              type: "string",
              example: "error",
            },
            message: {
              type: "string",
              example: "Resource not found",
            },
          },
        },

        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              example: "Mauricio Morais",
            },
            email: {
              type: "string",
              format: "email",
              example: "molde@test.com",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 6,
              example: "molde123",
            },
          },
        },

        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "molde@test.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "molde123",
            },
          },
        },

        RegisterResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "success",
            },
            message: {
              type: "string",
              example: "User registered successfully",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },

        LoginResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "success",
            },
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },

        Pagination: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              example: 1,
            },
            limit: {
              type: "integer",
              example: 10,
            },
            total: {
              type: "integer",
              example: 25,
            },
            totalPages: {
              type: "integer",
              example: 3,
            },
          },
        },

        Course: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            title: {
              type: "string",
              example: "Backend Development with Node.js",
            },
            platform: {
              type: "string",
              nullable: true,
              example: "Udemy",
            },
            description: {
              type: "string",
              nullable: true,
              example: "Practical backend development course.",
            },
            status: {
              type: "string",
              enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"],
              example: "IN_PROGRESS",
            },
            progress: {
              type: "integer",
              minimum: 0,
              maximum: 100,
              example: 40,
            },
            userId: {
              type: "string",
              format: "uuid",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        CreateCourseRequest: {
          type: "object",
          required: ["title"],
          properties: {
            title: {
              type: "string",
              example: "Backend Development with Node.js",
            },
            platform: {
              type: "string",
              example: "Udemy",
            },
            description: {
              type: "string",
              example: "Practical backend development course.",
            },
            status: {
              type: "string",
              enum: ["not_started", "in_progress", "completed"],
              example: "in_progress",
            },
            progress: {
              type: "integer",
              minimum: 0,
              maximum: 100,
              example: 40,
            },
          },
        },

        UpdateCourseRequest: {
          type: "object",
          minProperties: 1,
          properties: {
            title: {
              type: "string",
              example: "Advanced Backend Development",
            },
            platform: {
              type: "string",
              example: "Udemy",
            },
            description: {
              type: "string",
              example: "Updated course description.",
            },
            status: {
              type: "string",
              enum: ["not_started", "in_progress", "completed"],
              example: "completed",
            },
            progress: {
              type: "integer",
              minimum: 0,
              maximum: 100,
              example: 100,
            },
          },
        },

        CourseModule: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            title: {
              type: "string",
              example: "HTTP and REST",
            },
            description: {
              type: "string",
              nullable: true,
              example: "Study HTTP methods, headers and status codes.",
            },
            status: {
              type: "string",
              enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"],
              example: "IN_PROGRESS",
            },
            order: {
              type: "integer",
              minimum: 1,
              example: 1,
            },
            courseId: {
              type: "string",
              format: "uuid",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        CreateCourseModuleRequest: {
          type: "object",
          required: ["title", "order"],
          properties: {
            title: {
              type: "string",
              example: "HTTP and REST",
            },
            description: {
              type: "string",
              example: "Study HTTP methods, headers and status codes.",
            },
            status: {
              type: "string",
              enum: ["not_started", "in_progress", "completed"],
              example: "in_progress",
            },
            order: {
              type: "integer",
              minimum: 1,
              example: 1,
            },
          },
        },

        UpdateCourseModuleRequest: {
          type: "object",
          minProperties: 1,
          properties: {
            title: {
              type: "string",
              example: "Advanced HTTP and REST",
            },
            description: {
              type: "string",
              example: "Updated module description.",
            },
            status: {
              type: "string",
              enum: ["not_started", "in_progress", "completed"],
              example: "completed",
            },
            order: {
              type: "integer",
              minimum: 1,
              example: 2,
            },
          },
        },

        Job: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            company: {
              type: "string",
              example: "Flora Energia",
            },
            position: {
              type: "string",
              example: "Backend Developer",
            },
            location: {
              type: "string",
              nullable: true,
              example: "São Paulo, Brazil",
            },
            remote: {
              type: "boolean",
              example: true,
            },
            jobUrl: {
              type: "string",
              format: "uri",
              nullable: true,
              example: "https://example.com/jobs/backend",
            },
            description: {
              type: "string",
              nullable: true,
              example: "Backend position using Node.js and TypeScript.",
            },
            salaryRange: {
              type: "string",
              nullable: true,
              example: "R$ 6.000 - R$ 9.000",
            },
            status: {
              type: "string",
              enum: ["SAVED", "APPLIED", "INTERVIEW", "REJECTED", "OFFER"],
              example: "APPLIED",
            },
            appliedAt: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            userId: {
              type: "string",
              format: "uuid",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        CreateJobRequest: {
          type: "object",
          required: ["company", "position"],
          properties: {
            company: {
              type: "string",
              example: "Flora Energia",
            },
            position: {
              type: "string",
              example: "Backend Developer",
            },
            location: {
              type: "string",
              example: "São Paulo, Brazil",
            },
            remote: {
              type: "boolean",
              example: true,
            },
            jobUrl: {
              type: "string",
              format: "uri",
              example: "https://example.com/jobs/backend",
            },
            description: {
              type: "string",
              example: "Backend position using Node.js and TypeScript.",
            },
            salaryRange: {
              type: "string",
              example: "R$ 6.000 - R$ 9.000",
            },
            status: {
              type: "string",
              enum: ["saved", "applied", "interview", "rejected", "offer"],
              example: "saved",
            },
            appliedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        UpdateJobRequest: {
          type: "object",
          minProperties: 1,
          properties: {
            company: {
              type: "string",
              example: "Flora Energia",
            },
            position: {
              type: "string",
              example: "Senior Backend Developer",
            },
            location: {
              type: "string",
              example: "Remote",
            },
            remote: {
              type: "boolean",
              example: true,
            },
            jobUrl: {
              type: "string",
              format: "uri",
            },
            description: {
              type: "string",
              example: "Technical interview scheduled.",
            },
            salaryRange: {
              type: "string",
              example: "R$ 8.000 - R$ 12.000",
            },
            status: {
              type: "string",
              enum: ["saved", "applied", "interview", "rejected", "offer"],
              example: "interview",
            },
            appliedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        JobSummary: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            company: {
              type: "string",
              example: "Flora Energia",
            },
            position: {
              type: "string",
              example: "Backend Developer",
            },
            status: {
              type: "string",
              enum: ["SAVED", "APPLIED", "INTERVIEW", "REJECTED", "OFFER"],
              example: "APPLIED",
            },
            appliedAt: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
          },
        },

        Application: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            cvVersion: {
              type: "string",
              nullable: true,
              example: "Backend CV v2",
            },
            coverLetter: {
              type: "string",
              nullable: true,
              example: "Application focused on my backend experience.",
            },
            notes: {
              type: "string",
              nullable: true,
              example: "Applied through the company website.",
            },
            appliedAt: {
              type: "string",
              format: "date-time",
            },
            jobId: {
              type: "string",
              format: "uuid",
            },
            job: {
              $ref: "#/components/schemas/JobSummary",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        CreateApplicationRequest: {
          type: "object",
          properties: {
            cvVersion: {
              type: "string",
              example: "Backend CV v2",
            },
            coverLetter: {
              type: "string",
              example: "Application focused on my backend development experience.",
            },
            notes: {
              type: "string",
              example: "Applied through the company website.",
            },
            appliedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        UpdateApplicationRequest: {
          type: "object",
          minProperties: 1,
          properties: {
            cvVersion: {
              type: "string",
              example: "Backend CV v3",
            },
            coverLetter: {
              type: "string",
              example: "Updated cover letter.",
            },
            notes: {
              type: "string",
              example: "Recruiter confirmed receipt.",
            },
            appliedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
  },

  apis: [
    "./src/app.ts",
    "./src/routes/*.ts",
    "./dist/app.js",
    "./dist/routes/*.js",
  ],
};

export const swaggerSpecification = swaggerJsdoc(swaggerOptions);
