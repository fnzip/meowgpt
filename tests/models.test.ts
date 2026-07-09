import { describe, it, expect } from "bun:test";
import { buildModelsResponse } from "../src/handlers/models";

describe("buildModelsResponse", () => {
  it("returns a list with one model", () => {
    const res = buildModelsResponse();
    expect(res.object).toBe("list");
    expect(res.data).toHaveLength(1);
    expect(res.data[0]!.id).toBe("meowgpt");
    expect(res.data[0]!.object).toBe("model");
    expect(res.data[0]!.owned_by).toBe("meowgpt");
  });
});
