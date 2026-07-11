import { Hono } from "hono";
import { serve } from "bun";
import app from "../routes";

export interface ServerOptions {
  host?: string;
  port?: number;
}

const BANNER = `
    /\\_/\\
   ( o.o )   🐱 MeowGPT
    > ^ <    OpenAI-compatible mock server`;

export function createServer(options: ServerOptions = {}) {
  const host = options.host ?? "localhost";
  const port = options.port ?? 8787;
  const baseURL = `http://${host}:${port}/v1`;

  console.log(BANNER);
  console.log(`
  Local:              ${baseURL}`);
  console.log(`  Hosted:             https://meowgpt.alfian.dev/v1`);
  console.log(`
  Endpoints:`);
  console.log(`    GET  /v1/models`);
  console.log(`    POST /v1/chat/completions`);
  console.log(`    POST /v1/images/generations`);
  console.log(`
  Use in your AI agent / OpenAI client:`);
  console.log(`    baseURL: "${baseURL}"`);
  console.log(`    apiKey:  "meow" (any value works)`);
  console.log();

  return serve({
    fetch: app.fetch,
    hostname: host,
    port,
  });
}
