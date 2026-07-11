#!/usr/bin/env bun

import { createServer } from "../server";

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
🐱 MeowGPT — OpenAI-compatible mock server

Usage:
  meowgpt [options]
  meowgpt -h, --help
  meowgpt -v, --version

Options:
  --host      Host to bind (default: localhost)
  --port      Port to bind (default: 8787)
  -h, --help  Show this help
  -v, --version  Show version
`);
}

async function printVersion() {
  const pkg = await import("../../package.json");
  console.log(pkg.default.version);
}

if (args.includes("-h") || args.includes("--help")) {
  printHelp();
  process.exit(0);
}

if (args.includes("-v") || args.includes("--version")) {
  await printVersion();
  process.exit(0);
}

const options: { host?: string; port?: number } = {};

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--host" && i + 1 < args.length) {
    const host = args[++i];
    if (host) options.host = host;
  } else if (args[i] === "--port" && i + 1 < args.length) {
    const portStr = args[++i];
    if (!portStr) {
      console.error("Invalid port number");
      process.exit(1);
    }
    const port = parseInt(portStr, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      console.error("Invalid port number");
      process.exit(1);
    }
    options.port = port;
  } else if (args[i] === "-h" || args[i] === "--help") {
    // already handled above
  } else if (args[i] === "-v" || args[i] === "--version") {
    // already handled above
  } else {
    console.error(`Unknown option: ${args[i]}`);
    printHelp();
    process.exit(1);
  }
}

createServer(options);
