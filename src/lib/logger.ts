import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import pino from "pino";
import { pinoHttp } from "pino-http";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "password",
      "*.password",
    ],
    censor: "[REDACTED]",
  },
});

export const httpLogger = pinoHttp({
  logger,

  genReqId(request: IncomingMessage, response: ServerResponse) {
    const incomingId = request.headers["x-request-id"];

    const requestId =
      typeof incomingId === "string" && incomingId.trim().length > 0
        ? incomingId
        : randomUUID();

    response.setHeader("x-request-id", requestId);

    return requestId;
  },
});
