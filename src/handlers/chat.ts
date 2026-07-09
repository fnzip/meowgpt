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

const FOLLOWUP_QUESTION_REPLIES = [
  "Oh, following up! Good question. *sits up straight* Meow meow",
  "Another question! You're curious today. *purrs* Meow",
  "Building on what we discussed... *nods* Meow meow",
  "I like where this is going! *tail curls* Meow",
  "Deeper! I appreciate the follow-through. Meow meow",
  "*ears forward* Yes, let's dig into that. Meow",
  "Connecting the dots... *slow blink* Meow meow",
  "You're really thinking about this! *impressed purr* Meow",
];

const FOLLOWUP_GREETING_REPLIES = [
  "Back again! *happy tail swish* Meow meow",
  "Oh, still here! *purrs* What's next?",
  "Hello again! *stretches* Ready for more? Meow",
  "We meet again! *circles your feet* Meow",
  "Hi again! *rubs against your leg* Meow meow",
  "You came back! *excited purr* Meow!",
  "Round two! *perks up* Meow meow",
  "Still chatting? I like you. *slow blink* Meow",
];

const CONTEXTUAL_REPLIES = [
  'Following up on "{prev}" — *nods* meow meow',
  'Ah, building on "{prev}"! *tail swish* Meow',
  'I remember we talked about "{prev}". *purrs* Meow',
  'Right, after "{prev}"... *thinks* meow meow',
  'Picking up from "{prev}" — *ears perk* Meow',
  'Connected to "{prev}"! *happy purr* Meow meow',
  'Yes! Following "{prev}"... *circles* meow',
  'I was just thinking about "{prev}" too! Meow',
];

const ROLE_ACK_REPLIES = [
  "*reads system prompt carefully* Understood! Meow meow",
  "Got the briefing! *salutes with paw* Ready. Meow",
  "*nods along with the instructions* I'm on it. Meow meow",
  "Role acknowledged! *sits at attention* Meow",
  "Instructions received! *tail flicks* Let's go. Meow",
  "*absorbs the context* I know what to do. Meow meow",
  "Briefing complete! *stretches* Ready to assist. Meow",
  "Got it! *purrs* I'll play that role. Meow meow",
];

function buildResponseContent(req: ChatCompletionRequest): string {
  const history = req.messages.map((m) => ({
    role: m.role,
    content: extractText(m.content),
  }));

  const lastMsg = history[history.length - 1];
  const userContent = lastMsg?.content ?? "";

  if (!userContent) return pickRandom(MEOW_REPLIES);

  const lower = userContent.toLowerCase();

  // Check if this is a follow-up (more than 1 user message in history)
  const userMsgCount = history.filter((m) => m.role === "user").length;
  const isFollowUp = userMsgCount > 1;

  // Build context from previous assistant responses
  const prevAssistantMsgs = history
    .filter((m) => m.role === "assistant")
    .map((m) => m.content);
  const lastAssistantMsg = prevAssistantMsgs[prevAssistantMsgs.length - 1];

  // System prompt awareness
  const systemMsg = history.find((m) => m.role === "system");
  const hasSystemPrompt = !!systemMsg?.content;

  // Questions
  if (lower.includes("?")) {
    if (isFollowUp && lastAssistantMsg) {
      return pickRandom(FOLLOWUP_QUESTION_REPLIES);
    }
    return pickRandom(QUESTION_REPLIES);
  }

  // Greetings
  if (/^(hi|hey|hello|yo|sup|howdy|greetings)\b/.test(lower)) {
    if (isFollowUp) {
      return pickRandom(FOLLOWUP_GREETING_REPLIES);
    }
    return pickRandom(GREETING_REPLIES);
  }

  // Thanks
  if (/\b(thanks|thank you|thx|ty)\b/.test(lower)) {
    return pickRandom(THANKS_REPLIES);
  }

  // Laughter
  if (/\b(haha|lol|lmao|hehe|rofl)\b/.test(lower)) {
    return pickRandom(LAUGH_REPLIES);
  }

  // Meow variants
  if (/\b(meow|mew|miau|mewo|cat|kitty|feline)\b/i.test(lower)) {
    return pickRandom(CAT_REPLIES);
  }

  // Follow-up context — reference previous exchange
  if (isFollowUp && lastAssistantMsg) {
    return pickRandom(CONTEXTUAL_REPLIES).replace("{prev}", lastAssistantMsg.slice(0, 60));
  }

  // System prompt — acknowledge role
  if (hasSystemPrompt && userMsgCount === 1) {
    return pickRandom(ROLE_ACK_REPLIES);
  }

  // Long messages
  const wordCount = userContent.split(/\s+/).length;
  if (wordCount > 20) {
    return pickRandom(LONG_REPLIES);
  }

  // Default — echo with variety
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
