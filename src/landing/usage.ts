import { layout } from "./layout";

export function renderUsage(): string {
  return layout(
    "Usage",
    `
    <section class="page-hero">
      <div class="workbench-label">02 — Usage</div>
      <h1>Drop-in replacement for the OpenAI SDK</h1>
      <p class="hero-lede">Change the <code>baseURL</code> and everything else stays the same. Chat, streaming, and image generation all work out of the box.</p>
    </section>

    <section class="workbench">
      <div class="workbench-section">
        <h2>Chat completions</h2>
        <p>Use the OpenAI SDK as you normally would. Same API, same response shape.</p>
        <div class="code-frame">
          <div class="code-frame-header">
            <span class="code-frame-dot"></span><span class="code-frame-dot"></span><span class="code-frame-dot"></span>
            <span class="code-frame-label">chat.ts</span>
          </div>
          <div class="code-frame-body"><pre>import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "meow",
  baseURL: "https://meowgpt.alfian.dev/v1",
});

const chat = await client.chat.completions.create({
  model: "meowgpt",
  messages: [{ role: "user", content: "hello" }],
});

console.log(chat.choices[0].message.content);</pre></div>
        </div>
        <div class="response-block">
          <div class="response-block-label">response</div>
          <pre>Meow meow 🐱</pre>
        </div>

        <p style="margin-top:var(--space-md);font-size:0.8125rem;color:var(--color-ink-faint)">Add <code>delay_ms</code> to control response latency. Default 300ms. Set to 0 for instant CI responses.</p>

        <h3>curl</h3>
        <div class="code-frame">
          <div class="code-frame-header">
            <span class="code-frame-dot"></span><span class="code-frame-dot"></span><span class="code-frame-dot"></span>
            <span class="code-frame-label">terminal</span>
          </div>
          <div class="code-frame-body"><pre>$ curl https://meowgpt.alfian.dev/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{"model":"meowgpt","messages":[{"role":"user","content":"hello"}]}'

{
  "id": "chatcmpl_mock",
  "choices": [{ "message": { "content": "Meow meow 🐱" } }]
}</pre></div>
        </div>
      </div>

      <div class="workbench-section">
        <h2>Streaming</h2>
        <p>Server-Sent Events, same chunk format as OpenAI. Works with any SSE client.</p>
        <div class="code-frame">
          <div class="code-frame-header">
            <span class="code-frame-dot"></span><span class="code-frame-dot"></span><span class="code-frame-dot"></span>
            <span class="code-frame-label">stream.ts</span>
          </div>
          <div class="code-frame-body"><pre>const stream = await client.chat.completions.create({
  model: "meowgpt",
  messages: [{ role: "user", content: "hello" }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? "");
}</pre></div>
        </div>
        <div class="response-block">
          <div class="response-block-label">sse stream</div>
          <pre>data: {"id":"chatcmpl_mock","object":"chat.completion.chunk",...}
data: {"id":"chatcmpl_mock","object":"chat.completion.chunk",...}
data: [DONE]</pre>
        </div>
      </div>

      <div class="workbench-section">
        <h2>Image generation</h2>
        <p>Test your image generation pipeline without hitting a real API. Returns deterministic SVG cat images.</p>
        <div class="code-frame">
          <div class="code-frame-header">
            <span class="code-frame-dot"></span><span class="code-frame-dot"></span><span class="code-frame-dot"></span>
            <span class="code-frame-label">image.ts</span>
          </div>
          <div class="code-frame-body"><pre>const image = await client.images.generate({
  model: "meowgpt",
  prompt: "a cat",
});

console.log(image.data[0].url);
// https://meowgpt.dev/mock-image.png</pre></div>
        </div>
      </div>

      <div class="workbench-section">
        <h2>curl</h2>
        <p>No SDK required. MeowGPT speaks plain HTTP. Use curl, fetch, or any HTTP library.</p>
        <div class="code-frame">
          <div class="code-frame-header">
            <span class="code-frame-dot"></span><span class="code-frame-dot"></span><span class="code-frame-dot"></span>
            <span class="code-frame-label">terminal</span>
          </div>
          <div class="code-frame-body"><pre>$ curl https://meowgpt.alfian.dev/v1/models

{
  "object": "list",
  "data": [{ "id": "meowgpt", "object": "model", "owned_by": "meowgpt" }]
}</pre></div>
        </div>
      </div>
    </section>

    <section class="page-nav">
      <a href="/install" class="btn-secondary">← Install</a>
      <a href="/api" class="btn-primary">API Reference →</a>
    </section>
    `,
    "/usage"
  );
}
