import type { ChatCompletionRequest } from "../schemas/chat";

const MOCK_ID = "chatcmpl_mock";
const MOCK_CREATED = 123456789;
const MOCK_MODEL = "meowgpt";

const DEFAULT_DELAY_MS = 300;
const DEFAULT_CHUNK_DELAY_MS = 80;

function getDelay(req: ChatCompletionRequest): number {
  return req.delay_ms ?? DEFAULT_DELAY_MS;
}

function getChunkDelay(req: ChatCompletionRequest): number {
  return req.delay_ms != null
    ? Math.max(10, req.delay_ms / 4)
    : DEFAULT_CHUNK_DELAY_MS;
}

function extractText(content: unknown): string {
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return content
      .filter(
        (p): p is { type: "text"; text: string } =>
          typeof p === "object" &&
          p !== null &&
          "type" in p &&
          p.type === "text" &&
          "text" in p
      )
      .map((p) => p.text)
      .join(" ");
  }
  return "";
}

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

const MEOW_REPLIES = [
  "Meow meow",
  "Purrrr...",
  "Meow!",
  "Mrrrrow?",
  "Meow meow meow!",
  "*stretches lazily* meow",
  "Mew mew mew!",
  "*curls up* prrrrr",
  "Meow? *tilts head*",
  "Mrrp!",
];

const GREETING_REPLIES = [
  "Meow! Nice to see you",
  "Hey there! Meow meow",
  "Oh hi! *purrs*",
  "Hello! Ready to build something?",
  "Meow! What can I help with today?",
  "*perks ears* Oh, hello!",
  "Well hello there! *tail swish*",
  "Hi hi! *rubs against your leg* meow",
  "Greetings, human! Meow",
  "*wakes from nap* oh, hi! Meow",
];

const QUESTION_REPLIES = [
  "That's a great question! Let me think... Meow meow",
  "Hmm, interesting! I'd say... meow?",
  "Good one! The answer is probably 42. Or meow.",
  "You ask the tough questions! Meow meow",
  "Let me consult the cat council... they say meow",
  "*squints thoughtfully* That depends... on how many treats are involved",
  "Excellent question! *washes paw while thinking* Meow",
  "Hmm, let me nap on it... zzz... oh! Meow!",
  "The ancient cats once pondered this too. Their answer: meow",
  "Tricky! *chases tail for a bit* Okay, meow",
];

const THANKS_REPLIES = [
  "You're welcome! Meow",
  "Anytime! *happy purr*",
  "No problem at all! Meow meow",
  "Aw thanks for saying thanks!",
  "*purrs loudly* you're very welcome!",
  "Of course! *slow blink* (that means I like you)",
  "My pleasure! *kneads the air* meow",
  "Don't mention it! *rolls over* meow",
];

const LAUGH_REPLIES = [
  "Hehe, meow meow!",
  "Glad I could make you laugh!",
  "Meow haha! You're fun",
  "*purrs in amusement*",
  "*falls over laughing* meow meow meow!",
  "You got me! *giggles in cat*",
  "Haha! *chases own tail in celebration*",
  "That's a good one! *purr-chuckles*",
];

const CAT_REPLIES = [
  "You speak the sacred language! Meow meow meow!",
  "Mew mew! A fellow cat enthusiast",
  "Purrrrr... you get it",
  "Meow! That's my favorite word",
  "Mrow! *tail flick*",
  "*ears perk up* Did someone say meow?",
  "Finally, someone who understands! Meow meow!",
  "*circles your feet* mew mew mew!",
  "The council of cats approves your message. Meow.",
  "*purrs aggressively* YES. Meow.",
];

const LONG_REPLIES = [
  "Thank you for the detailed message! I've processed your input and here's my response: Meow meow",
  "That's quite a lot to take in! Let me digest that... Meow!",
  "I appreciate the thorough explanation. My considered response: meow meow",
  "Wow, that's comprehensive! After careful analysis: meow",
  "*reads carefully, tail twitching* Fascinating. Meow.",
  "You've given me much to think about. *circles three times, sits* Meow.",
  "I read every word. *slow blink* My verdict: meow meow",
  "That's a lot of words! *pushes glass off table* Meow.",
  "*nods sagely* I have considered all points. Meow.",
  "Thorough! *stretches* Here's my executive summary: meow",
];

const ECHO_REPLIES = [
  'I see you said "{msg}". Meow meow',
  'Got it! "{msg}" - interesting! Meow',
  'Ah, "{msg}"! Let me think about that... meow',
  'Hmm, "{msg}". Noted! Meow meow',
  'You mentioned "{msg}". Fascinating! Meow',
  'Right, "{msg}". I am on it! Meow',
  '"{msg}" - *tilts head* meow?',
  'Oh! "{msg}"! *perks up* meow meow',
  'Interesting... "{msg}". *washes face* meow',
  '"{msg}" - got it! *tail swish* meow',
  'Noted: "{msg}". Adding to my cat-log. Meow.',
  '"{msg}" huh? *sniffs the air* meow',
];

function buildResponseContent(req: ChatCompletionRequest): string {
  const lastMsg = req.messages[req.messages.length - 1];
  const userContent = extractText(lastMsg?.content);

  if (!userContent) return pickRandom(MEOW_REPLIES);

  const lower = userContent.toLowerCase();

  if (lower.includes("?")) {
    return pickRandom(QUESTION_REPLIES);
  }

  if (/^(hi|hey|hello|yo|sup|howdy|greetings)\b/.test(lower)) {
    return pickRandom(GREETING_REPLIES);
  }

  if (/\b(thanks|thank you|thx|ty)\b/.test(lower)) {
    return pickRandom(THANKS_REPLIES);
  }

  if (/\b(haha|lol|lmao|hehe|rofl)\b/.test(lower)) {
    return pickRandom(LAUGH_REPLIES);
  }

  if (/\b(meow|mew|miau|mewo|cat|kitty|feline)\b/i.test(lower)) {
    return pickRandom(CAT_REPLIES);
  }

  const wordCount = userContent.split(/\s+/).length;
  if (wordCount > 20) {
    return pickRandom(LONG_REPLIES);
  }

  return pickRandom(ECHO_REPLIES).replace(
    "{msg}",
    userContent.length > 40
      ? userContent.slice(0, 40) + "..."
      : userContent
  );
}

interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
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
  usage: Usage;
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
  usage?: Usage;
}

function countTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

function computeUsage(
  req: ChatCompletionRequest,
  responseContent: string
): Usage {
  const promptText = req.messages
    .map((m) => extractText(m.content))
    .join(" ");
  const promptTokens = countTokens(promptText);
  const completionTokens = countTokens(responseContent);
  return {
    prompt_tokens: promptTokens,
    completion_tokens: completionTokens,
    total_tokens: promptTokens + completionTokens,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function buildChatCompletion(
  req: ChatCompletionRequest
): Promise<ChatCompletionResponse> {
  const content = buildResponseContent(req);
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
          content,
        },
        finish_reason: "stop",
      },
    ],
    usage: computeUsage(req, content),
  };
}

export async function* streamChatCompletion(
  req: ChatCompletionRequest
): AsyncGenerator<ChatCompletionChunk> {
  const content = buildResponseContent(req);
  const chunkDelay = getChunkDelay(req);
  const usage = computeUsage(req, content);

  await sleep(chunkDelay * 2);

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
    usage,
  };

  await sleep(chunkDelay);

  const tokens = content.match(/\S+\s*/g) ?? [content];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!;
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
      usage,
    };
  }

  await sleep(chunkDelay);

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
    usage,
  };
}
