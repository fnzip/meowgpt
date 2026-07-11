import type { Hono } from "hono";
import { chatCompletionRequestSchema } from "../schemas/chat";
import { imageGenerationRequestSchema } from "../schemas/image";
import { buildChatCompletion, streamChatCompletion } from "../handlers/chat";
import { buildModelsResponse } from "../handlers/models";
import { buildImageGeneration } from "../handlers/image";

export function setupAPIRoutes(app: Hono) {
  // GET /v1/models
  app.get("/v1/models", (c) => {
    return c.json(buildModelsResponse());
  });

  // POST /v1/chat/completions
  app.post("/v1/chat/completions", async (c) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json(
        {
          error: {
            message: "Invalid JSON in request body",
            type: "invalid_request_error",
            code: "invalid_json",
          },
        },
        400
      );
    }

    const parsed = chatCompletionRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        {
          error: {
            message: parsed.error.issues
              .map((i) => `${i.path.join(".")}: ${i.message}`)
              .join("; "),
            type: "invalid_request_error",
            code: "invalid_parameters",
          },
        },
        400
      );
    }

    const req = parsed.data;

    if (req.stream) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of streamChatCompletion(req)) {
            const data = `data: ${JSON.stringify(chunk)}\n\n`;
            controller.enqueue(encoder.encode(data));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    return c.json(await buildChatCompletion(req));
  });

  // POST /v1/images/generations
  app.post("/v1/images/generations", async (c) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json(
        {
          error: {
            message: "Invalid JSON in request body",
            type: "invalid_request_error",
            code: "invalid_json",
          },
        },
        400
      );
    }

    const parsed = imageGenerationRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        {
          error: {
            message: parsed.error.issues
              .map((i) => `${i.path.join(".")}: ${i.message}`)
              .join("; "),
            type: "invalid_request_error",
            code: "invalid_parameters",
          },
        },
        400
      );
    }

    return c.json(buildImageGeneration(parsed.data));
  });

  // 500 handler
  app.onError((err, c) => {
    console.error("Unhandled error:", err);
    return c.json(
      {
        error: {
          message: "Internal server error",
          type: "server_error",
          code: "internal_error",
        },
      },
      500
    );
  });
}

export function setupAPICatchAll(app: Hono) {
  // 404 for unmatched routes
  app.all("*", (c) => {
    return c.json(
      {
        error: {
          message: `Not found: ${c.req.method} ${c.req.path}`,
          type: "invalid_request_error",
          code: "not_found",
        },
      },
      404
    );
  });
}
