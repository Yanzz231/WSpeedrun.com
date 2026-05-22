import { Injectable, NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";

const SENSITIVE_KEYS = ["password", "token", "deviceToken", "authorization"];

function maskSensitive(obj: unknown): unknown {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;

  const record = obj as Record<string, unknown>;

  return Object.fromEntries(
    Object.entries(record).map(([key, value]) =>
      SENSITIVE_KEYS.some((sensitiveKey) =>
        key.toLowerCase().includes(sensitiveKey),
      )
        ? [key, "***"]
        : [key, value],
    ),
  );
}

function hasEntries(obj: unknown): obj is Record<string, unknown> {
  return (
    obj !== null &&
    typeof obj === "object" &&
    !Array.isArray(obj) &&
    Object.keys(obj).length > 0
  );
}

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    const { method, originalUrl } = req;

    res.on("finish", () => {
      const duration = Date.now() - start;
      const requestBody = req.body as unknown;
      const requestQuery = req.query as unknown;

      console.log("-".repeat(60));
      console.log(
        `${method.padEnd(6)} ${res.statusCode} ${originalUrl} ${duration}ms`,
      );

      if (hasEntries(requestQuery)) {
        console.log("  query", JSON.stringify(maskSensitive(requestQuery)));
      }

      if (hasEntries(requestBody)) {
        console.log("  body ", JSON.stringify(maskSensitive(requestBody)));
      }
    });

    next();
  }
}
