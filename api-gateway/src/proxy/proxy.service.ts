// Module
import { BadGatewayException, Injectable } from "@nestjs/common";
import axios from "axios";
import type { Request, Response } from "express";

export type ServiceName = "auth" | "game" | "run";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

@Injectable()
export class ProxyService {
  private readonly timeout = Number(process.env.GATEWAY_TIMEOUT_MS ?? 15000);

  private readonly serviceUrls: Record<ServiceName, string> = {
    auth: this.normalizeBaseUrl(
      process.env.AUTH_SERVICE_URL ?? "http://localhost:3000",
    ),
    game: this.normalizeBaseUrl(
      process.env.GAME_SERVICE_URL ?? "http://localhost:3001",
    ),
    run: this.normalizeBaseUrl(
      process.env.RUN_SERVICE_URL ?? "http://localhost:3002",
    ),
  };

  async forward(
    serviceName: ServiceName,
    req: Request,
    res: Response,
  ): Promise<void> {
    const targetUrl = this.buildTargetUrl(serviceName, req.originalUrl);
    const requestData: unknown = this.shouldForwardBody(req.method)
      ? (req.body as unknown)
      : undefined;

    try {
      const response = await axios.request({
        url: targetUrl,
        method: req.method,
        headers: this.buildForwardHeaders(req),
        data: requestData,
        timeout: this.timeout,
        validateStatus: () => true,
      });
      const responseData: unknown = response.data;

      this.copyResponseHeaders(response.headers, res);
      res.status(response.status).send(responseData);
    } catch {
      throw new BadGatewayException(
        `Unable to reach ${serviceName} service at ${this.serviceUrls[serviceName]}`,
      );
    }
  }

  private normalizeBaseUrl(url: string) {
    return url.replace(/\/+$/, "");
  }

  private buildTargetUrl(serviceName: ServiceName, originalUrl: string) {
    return `${this.serviceUrls[serviceName]}${originalUrl}`;
  }

  private shouldForwardBody(method: string) {
    return !["GET", "HEAD"].includes(method.toUpperCase());
  }

  private buildForwardHeaders(req: Request) {
    const headers: Record<string, string | string[]> = {};

    Object.entries(req.headers).forEach(([key, value]) => {
      if (value === undefined || HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
        return;
      }

      headers[key] = value;
    });

    const host = req.get("host");

    if (host) {
      headers["x-forwarded-host"] = host;
    }

    headers["x-forwarded-proto"] = req.protocol;

    return headers;
  }

  private copyResponseHeaders(
    responseHeaders: Record<string, unknown>,
    res: Response,
  ) {
    Object.entries(responseHeaders).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        HOP_BY_HOP_HEADERS.has(key.toLowerCase())
      ) {
        return;
      }

      if (Array.isArray(value)) {
        res.setHeader(key, value.map(String));
        return;
      }

      if (typeof value === "string" || typeof value === "number") {
        res.setHeader(key, value);
        return;
      }

      if (typeof value === "boolean") {
        res.setHeader(key, value ? "true" : "false");
      }
    });
  }
}
