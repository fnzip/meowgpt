import { Hono } from "hono";
import { serve } from "bun";
import app from "../routes";

export interface ServerOptions {
  host?: string;
  port?: number;
}

export function createServer(options: ServerOptions = {}) {
  const host = options.host ?? "localhost";
  const port = options.port ?? 8787;

  console.log(`🐱 MeowGPT server running at http://${host}:${port}`);

  return serve({
    fetch: app.fetch,
    hostname: host,
    port,
  });
}
