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
    expect(res.choices[0]!.message.content).toContain("Meow meow 🐱");
    expect(res.choices[0]!.finish_reason).toBe("stop");
  });

  it("echoes short user messages", async () => {
    const res = await buildChatCompletion({
      model: "meowgpt",
      messages: [{ role: "user", content: "hi" }],
      stream: false,
    });

    expect(res.choices[0]!.message.content).toContain("hi");
  });

  it("responds to questions differently", async () => {
    const res = await buildChatCompletion({
      model: "meowgpt",
      messages: [{ role: "user", content: "what is this?" }],
      stream: false,
    });

    expect(res.choices[0]!.message.content).toContain("great question");
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

    expect(res.choices[0]!.message.content).toContain("detailed message");
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

    // First chunk: role
    expect(chunks[0]!.object).toBe("chat.completion.chunk");
    expect(chunks[0]!.choices[0]!.delta.role).toBe("assistant");
    expect(chunks[0]!.choices[0]!.finish_reason).toBeNull();

    // Last chunk: finish_reason
    const last = chunks[chunks.length - 1]!;
    expect(last.choices[0]!.finish_reason).toBe("stop");
    expect(last.choices[0]!.delta.content).toBeUndefined();
  });
});
