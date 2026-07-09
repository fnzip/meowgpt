import { describe, it, expect } from "bun:test";
import app from "../src/routes";

describe("GET /v1/models", () => {
  it("returns models list", async () => {
    const res = await app.request("/v1/models");
    expect(res.status).toBe(200);
    const body = await res.json() as Record<string, unknown>;
    expect(body.object).toBe("list");
    expect(Array.isArray(body.data)).toBe(true);
  });
});

describe("POST /v1/chat/completions", () => {
  it("returns chat completion", async () => {
    const res = await app.request("/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "meowgpt",
        messages: [{ role: "user", content: "hello" }],
      }),
    });
    expect(res.status).toBe(200);
    const body = await res.json() as Record<string, unknown>;
    const choices = body.choices as Array<{ message: { content: string } }>;
    expect(choices[0]!.message.content).toContain("Meow");
  });

  it("returns streaming SSE", async () => {
    const res = await app.request("/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "meowgpt",
        messages: [{ role: "user", content: "hello" }],
        stream: true,
      }),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/event-stream");

    const text = await res.text();
    expect(text).toContain("data: [DONE]");
    expect(text).toContain("chat.completion.chunk");
  });

  it("returns 400 for invalid body", async () => {
    const res = await app.request("/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
    const body = await res.json() as Record<string, unknown>;
    expect(body.error).toBeDefined();
  });

  it("returns 400 for invalid JSON", async () => {
    const res = await app.request("/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json",
    });
    expect(res.status).toBe(400);
  });
});

describe("POST /v1/images/generations", () => {
  it("returns image generation", async () => {
    const res = await app.request("/v1/images/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "a cat" }),
    });
    expect(res.status).toBe(200);
    const body = await res.json() as Record<string, unknown>;
    const data = body.data as Array<{ url: string }>;
    expect(data[0]!.url).toBeDefined();
  });

  it("returns 400 for missing prompt", async () => {
    const res = await app.request("/v1/images/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });
});

describe("404 handling", () => {
  it("returns 404 for unknown routes", async () => {
    const res = await app.request("/v1/nonexistent");
    expect(res.status).toBe(404);
  });
});
