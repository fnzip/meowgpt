import type { ChatCompletionRequest } from "../schemas/chat";

const MOCK_ID = "chatcmpl_mock";
const MOCK_CREATED = 123456789;
const MOCK_MODEL = "meowgpt";

const DEFAULT_DELAY_MS = 300;
const DEFAULT_CHUNK_DELAY_MS = 80;

function getDelay(req: ChatCompletionRequest): number {
  return DEFAULT_DELAY_MS;
}

function getChunkDelay(req: ChatCompletionRequest): number {
  return DEFAULT_CHUNK_DELAY_MS;
}

function buildResponseContent(req: ChatCompletionRequest): string {
  const lastMsg = req.messages[req.messages.length - 1];
  const userContent =
    typeof lastMsg?.content === "string" ? lastMsg.content.trim() : "";

  if (!userContent) return "Meow meow 🐱";

  const lower = userContent.toLowerCase();

  if (lower.includes("?")) {
    return "That's a great question! Let me think about it... Meow meow 🐱";
  }

  if (lower.length < 10) {
    return `I see you said "${userContent}". Meow meow 🐱`;
  }

  const wordCount = userContent.split(/\s+/).length;
  if (wordCount > 20) {
    return `Thank you for the detailed message. I've processed your input and here's my response: Meow meow 🐱`;
  }

  return `Got it! You mentioned "${userContent.slice(0, 40)}${userContent.length > 40 ? "..." : ""}". Meow meow 🐱`;
}

interface ChatCompletionChoice {
  index: number;
  message: {
    role: "assistant";
    content: string;
  };
  finish_reason: "stop";
}

interface ChatCompletionResponse {
  id: string;
  object: "chat.completion";
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
}

interface ChatCompletionChunk {
  id: string;
  object: "chat.completion.chunk";
  created: number;
  model: string;
  choices: {
    index: number;
    delta: {
      role?: "assistant";
      content?: string;
    };
    finish_reason: "stop" | null;
  }[];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function buildChatCompletion(
  req: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  const delay = getDelay(req);
  if (delay > 0) await sleep(delay);

  return {
    id: MOCK_ID,
    object: "chat.completion",
    created: MOCK_CREATED,
    model: MOCK_MODEL,
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: buildResponseContent(req),
        },
        finish_reason: "stop",
      },
    ],
  };
}

export async function* streamChatCompletion(
  req: ChatCompletionRequest
): AsyncGenerator<ChatCompletionChunk> {
  const content = buildResponseContent(req);
  const chunkDelay = getChunkDelay(req);

  // Initial thinking delay
  await sleep(chunkDelay * 2);

  // First chunk with role
  yield {
    id: MOCK_ID,
    object: "chat.completion.chunk",
    created: MOCK_CREATED,
    model: MOCK_MODEL,
    choices: [
      {
        index: 0,
        delta: { role: "assistant" },
        finish_reason: null,
      },
    ],
  };

  await sleep(chunkDelay);

  // Tokenize by words + punctuation for natural-feeling chunks
  const tokens = content.match(/\S+\s*/g) ?? [content];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!;
    // Vary delay slightly per token for realism
    const jitter = (Math.random() - 0.5) * chunkDelay * 0.4;
    await sleep(Math.max(10, chunkDelay + jitter));

    yield {
      id: MOCK_ID,
      object: "chat.completion.chunk",
      created: MOCK_CREATED,
      model: MOCK_MODEL,
      choices: [
        {
          index: 0,
          delta: { content: token },
          finish_reason: null,
        },
      ],
    };
  }

  await sleep(chunkDelay);

  // Final chunk with finish_reason
  yield {
    id: MOCK_ID,
    object: "chat.completion.chunk",
    created: MOCK_CREATED,
    model: MOCK_MODEL,
    choices: [
      {
        index: 0,
        delta: {},
        finish_reason: "stop",
      },
    ],
  };
}
