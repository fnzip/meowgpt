import type { ImageGenerationRequest } from "../schemas/image";

const MOCK_CREATED = 123456789;

// A simple SVG cat face as base64 data URL
function toBase64(str: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

const MOCK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="#fef3c7"/>
  <ellipse cx="350" cy="400" rx="80" ry="100" fill="#1e293b"/>
  <ellipse cx="674" cy="400" rx="80" ry="100" fill="#1e293b"/>
  <ellipse cx="350" cy="420" rx="30" ry="40" fill="#fef3c7"/>
  <ellipse cx="674" cy="420" rx="30" ry="40" fill="#fef3c7"/>
  <ellipse cx="512" cy="550" rx="30" ry="20" fill="#f472b6"/>
  <path d="M 400 650 Q 512 750 624 650" stroke="#1e293b" stroke-width="12" fill="none" stroke-linecap="round"/>
  <line x1="300" y1="200" x2="350" y2="300" stroke="#1e293b" stroke-width="8" stroke-linecap="round"/>
  <line x1="724" y1="200" x2="674" y2="300" stroke="#1e293b" stroke-width="8" stroke-linecap="round"/>
  <line x1="280" y1="180" x2="330" y2="280" stroke="#1e293b" stroke-width="8" stroke-linecap="round"/>
  <line x1="744" y1="180" x2="694" y2="280" stroke="#1e293b" stroke-width="8" stroke-linecap="round"/>
  <text x="512" y="900" text-anchor="middle" font-size="48" fill="#1e293b" font-family="sans-serif">🐱 MeowGPT</text>
</svg>`;

const MOCK_IMAGE_BASE64 = "data:image/svg+xml;base64," + toBase64(MOCK_SVG);

const MOCK_URL = "https://meowgpt.dev/mock-image.png";

interface ImageData {
  url?: string;
  b64_json?: string;
  revised_prompt?: string;
}

interface ImageGenerationResponse {
  created: number;
  data: ImageData[];
}

export function buildImageGeneration(
  req: ImageGenerationRequest
): ImageGenerationResponse {
  const data: ImageData[] = [];

  const n = req.n ?? 1;
  const responseFormat = req.response_format ?? "url";

  for (let i = 0; i < n; i++) {
    if (responseFormat === "b64_json") {
      data.push({
        b64_json: MOCK_IMAGE_BASE64,
        revised_prompt: req.prompt,
      });
    } else {
      data.push({
        url: MOCK_URL,
        revised_prompt: req.prompt,
      });
    }
  }

  return {
    created: MOCK_CREATED,
    data,
  };
}
