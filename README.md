# 🐱 MeowGPT

**OpenAI-compatible mock server** for development, testing, CI, SDK validation, and agent orchestration.

MeowGPT is **NOT** an LLM. It emulates the OpenAI API so existing OpenAI SDKs work by changing only the `baseURL`.

> MeowGPT is not affiliated with or provided by OpenAI.

## Quick Start

```bash
# Install
bun install

# Start server
bun run dev

# Or via CLI
bun run src/cli/index.ts serve
```

Server starts at `http://localhost:8787`.

### CLI Options

```bash
meowgpt serve --host 0.0.0.0 --port 8080
meowgpt -h
meowgpt -v
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/models` | List models |
| POST | `/v1/chat/completions` | Chat completions (streaming supported) |
| POST | `/v1/images/generations` | Image generation |

## Usage with OpenAI SDK

```ts
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "meow",
  baseURL: "http://localhost:8787/v1",
});

// Chat
const chat = await client.chat.completions.create({
  model: "meowgpt",
  messages: [{ role: "user", content: "hello" }],
});
console.log(chat.choices[0].message.content); // "Meow meow 🐱"

// Streaming
const stream = await client.chat.completions.create({
  model: "meowgpt",
  messages: [{ role: "user", content: "hello" }],
  stream: true,
});
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? "");
}

// Images
const image = await client.images.generate({
  model: "meowgpt",
  prompt: "a cat",
});
console.log(image.data[0].url);
```

## curl Examples

```bash
# List models
curl http://localhost:8787/v1/models

# Chat completion
curl http://localhost:8787/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"meowgpt","messages":[{"role":"user","content":"hello"}]}'

# Streaming
curl http://localhost:8787/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"meowgpt","messages":[{"role":"user","content":"hello"}],"stream":true}'

# Image generation
curl http://localhost:8787/v1/images/generations \
  -H "Content-Type: application/json" \
  -d '{"prompt":"a cat"}'
```

## Cloudflare Deployment

```bash
bun run deploy
```

Requires [Wrangler](https://developers.cloudflare.com/workers/wrangler/) configured.

## Testing

```bash
bun test
```

## Project Structure

```
src/
  cli/          CLI entry point
  server/       Local server (Bun.serve)
  routes/       Hono route definitions
  handlers/     Business logic
  schemas/      Zod validation schemas
worker/         Cloudflare Worker entry
tests/          Unit & integration tests
examples/       SDK usage examples
```

## Design

- **Deterministic** — always returns the same responses
- **Zero config** — works out of the box
- **Fast** — cold start in milliseconds
- **Minimal deps** — Hono + Zod only
- **Production quality** — strict TypeScript, proper error handling, comprehensive tests

## License

MIT
