import { describe, it, expect } from "bun:test";
import { buildChatCompletion, streamChatCompletion } from "../src/handlers/chat";

describe("buildChatCompletion", () => {
  it("returns a valid chat completion", () => {
    const res = buildChatCompletion({
      model: "meowgpt",
      messages: [{ role: "user", content: "hello" }],
      stream: false,
    });

    expect(res.id).toBe("chatcmpl_mock");
    expect(res.object).toBe("chat.completion");
    expect(res.model).toBe("meowgpt");
    expect(res.choices).toHaveLength(1);
    expect(res.choices[0]!.message.role).toBe("assistant");
    expect(res.choices[0]!.message.content).toBe("Meow meow 🐱");
    expect(res.choices[0]!.finish_reason).toBe("stop");
  });
});

describe("streamChatCompletion", () => {
  it("yields role chunk, content chunks, and final chunk", () => {
    const chunks = [
      ...streamChatCompletion({
        model: "meowgpt",
        messages: [{ role: "user", content: "hello" }],
        stream: true,
      }),
    ];

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
