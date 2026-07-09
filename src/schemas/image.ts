import { z } from "zod";

export const imageGenerationRequestSchema = z.object({
  model: z.string().optional().default("meowgpt"),
  prompt: z.string().min(1),
  n: z.number().int().min(1).max(10).optional().default(1),
  size: z
    .enum(["256x256", "512x512", "1024x1024", "1792x1024", "1024x1792"])
    .optional()
    .default("1024x1024"),
  response_format: z.enum(["url", "b64_json"]).optional().default("url"),
  quality: z.enum(["standard", "hd"]).optional().default("standard"),
  style: z.enum(["vivid", "natural"]).optional().default("vivid"),
  user: z.string().optional(),
});

export type ImageGenerationRequest = z.infer<
  typeof imageGenerationRequestSchema
>;
