import { describe, it, expect } from "bun:test";
import { buildImageGeneration } from "../src/handlers/image";

describe("buildImageGeneration", () => {
  it("returns URL by default", () => {
    const res = buildImageGeneration({
      model: "meowgpt",
      prompt: "a cat",
      n: 1,
      size: "1024x1024",
      response_format: "url",
      quality: "standard",
      style: "vivid",
    });

    expect(res.created).toBe(123456789);
    expect(res.data).toHaveLength(1);
    expect(res.data[0]!.url).toBe("https://meowgpt.dev/mock-image.png");
    expect(res.data[0]!.revised_prompt).toBe("a cat");
  });

  it("returns b64_json when requested", () => {
    const res = buildImageGeneration({
      model: "meowgpt",
      prompt: "a cat",
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
      quality: "standard",
      style: "vivid",
    });

    expect(res.data[0]!.b64_json).toStartWith("data:image/svg+xml;base64,");
    expect(res.data[0]!.url).toBeUndefined();
  });

  it("returns n images", () => {
    const res = buildImageGeneration({
      model: "meowgpt",
      prompt: "a cat",
      n: 3,
      size: "1024x1024",
      response_format: "url",
      quality: "standard",
      style: "vivid",
    });

    expect(res.data).toHaveLength(3);
  });
});
