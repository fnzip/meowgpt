import type { ChatCompletionRequest } from "../schemas/chat";

const MOCK_ID = "chatcmpl_mock";
const MOCK_CREATED = 123456789;
const MOCK_MODEL = "meowgpt";
const MOCK_CONTENT = "Meow meow 🐱";

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

export function buildChatCompletion(
  _req: ChatCompletionRequest
): ChatCompletionResponse {
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
          content: MOCK_CONTENT,
        },
        finish_reason: "stop",
      },
    ],
  };
}

export function* streamChatCompletion(
  _req: ChatCompletionRequest
): Generator<ChatCompletionChunk> {
  const words = MOCK_CONTENT.split(" ");

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

  // Content chunks
  for (let i = 0; i < words.length; i++) {
    yield {
      id: MOCK_ID,
      object: "chat.completion.chunk",
      created: MOCK_CREATED,
      model: MOCK_MODEL,
      choices: [
        {
          index: 0,
          delta: { content: i === 0 ? words[i] : " " + words[i] },
          finish_reason: null,
        },
      ],
    };
  }

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
