import "dotenv/config";
import { app } from "./app.js";
import { logger } from "./lib/logger.js";
import { prisma } from "./lib/prisma.js";

const port = Number(process.env.PORT ?? 3000);

const server = app.listen(port, () => {
  logger.info({ port }, "Server started");
});

let isShuttingDown = false;

async function shutdown(signal: NodeJS.Signals) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  logger.info({ signal }, "Shutdown signal received");

  const forceShutdownTimer = setTimeout(() => {
    logger.error("Graceful shutdown timed out");
    process.exit(1);
  }, 10_000);

  forceShutdownTimer.unref();

  server.close(async (error) => {
    if (error) {
      logger.error({ err: error }, "Failed to close HTTP server");
      process.exitCode = 1;
    }

    try {
      await prisma.$disconnect();
      logger.info("Database connection closed");
    } catch (disconnectError) {
      logger.error({ err: disconnectError }, "Failed to disconnect database");
      process.exitCode = 1;
    }

    clearTimeout(forceShutdownTimer);

    process.exit();
  });
}

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
