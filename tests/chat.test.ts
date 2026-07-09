import { describe, it, expect } from "bun:test";
import { buildChatCompletion, streamChatCompletion } from "../src/handlers/chat";

describe("buildChatCompletion", () => {
  it("returns a valid chat completion", async () => {
    const res = await buildChatCompletion({
      model: "meowgpt",
      messages: [{ role: "user", content: "hello" }],
      stream: false,
    });

    expect(res.id).toBe("chatcmpl_mock");
    expect(res.object).toBe("chat.completion");
    expect(res.model).toBe("meowgpt");
    expect(res.choices).toHaveLength(1);
    expect(res.choices[0]!.message.role).toBe("assistant");
    expect(res.choices[0]!.message.content.length).toBeGreaterThan(0);
    expect(res.choices[0]!.finish_reason).toBe("stop");
  });

  it("echoes non-greeting short messages", async () => {
    const res = await buildChatCompletion({
      model: "meowgpt",
      messages: [{ role: "user", content: "test" }],
      stream: false,
    });

    expect(res.choices[0]!.message.content).toContain("test");
  });

  it("responds to questions", async () => {
    const res = await buildChatCompletion({
      model: "meowgpt",
      messages: [{ role: "user", content: "what is this?" }],
      stream: false,
    });

    expect(res.choices[0]!.message.content.length).toBeGreaterThan(0);
  });

  it("handles long messages", async () => {
    const res = await buildChatCompletion({
      model: "meowgpt",
      messages: [
        {
          role: "user",
          content:
            "this is a very long message with many many many words to test the long message response path in the handler",
        },
      ],
      stream: false,
    });

    expect(res.choices[0]!.message.content.length).toBeGreaterThan(0);
  });

  it("returns different responses for same input", async () => {
    const results = new Set<string>();
    for (let i = 0; i < 10; i++) {
      const res = await buildChatCompletion({
        model: "meowgpt",
        messages: [{ role: "user", content: "test" }],
        stream: false,
      });
      results.add(res.choices[0]!.message.content);
    }
    // Should get at least 2 different responses from 10 calls
    expect(results.size).toBeGreaterThanOrEqual(2);
  });
});

describe("streamChatCompletion", () => {
  it("yields role chunk, content chunks, and final chunk", async () => {
    const chunks: any[] = [];
    for await (const chunk of streamChatCompletion({
      model: "meowgpt",
      messages: [{ role: "user", content: "hello" }],
      stream: true,
    })) {
      chunks.push(chunk);
    }

    expect(chunks.length).toBeGreaterThanOrEqual(3);

    expect(chunks[0]!.object).toBe("chat.completion.chunk");
    expect(chunks[0]!.choices[0]!.delta.role).toBe("assistant");
    expect(chunks[0]!.choices[0]!.finish_reason).toBeNull();

    const last = chunks[chunks.length - 1]!;
    expect(last.choices[0]!.finish_reason).toBe("stop");
    expect(last.choices[0]!.delta.content).toBeUndefined();
  });
});
