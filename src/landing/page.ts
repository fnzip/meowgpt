export function renderLandingPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MeowGPT — OpenAI-compatible mock server</title>
  <meta name="description" content="A lightweight, deterministic mock server that emulates the OpenAI API. Point any OpenAI SDK at it by changing only the baseURL." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/landing/tokens.css" />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐱</text></svg>" />
</head>
<body>
  <nav class="nav">
    <a href="/" class="nav-brand">🐱 MeowGPT</a>
    <ul class="nav-links">
      <li><a href="#install">Install</a></li>
      <li><a href="#usage">Usage</a></li>
      <li><a href="#api">API</a></li>
      <li><a href="https://github.com/fnzip/meowgpt">GitHub</a></li>
    </ul>
    <a href="#install" class="nav-cta">Get started</a>
  </nav>

  <main>
    <section class="hero">
      <div class="hero-badge">v0.1.0</div>
      <h1>An OpenAI-compatible<br /><em>mock server</em> for dev &amp; test</h1>
      <p class="hero-lede">Point any OpenAI SDK at MeowGPT by changing only the <code>baseURL</code>. Deterministic responses, zero config, cold start in milliseconds. Built for SDK testing, CI pipelines, and agent development.</p>
      <div class="hero-actions">
        <a href="#install" class="btn-primary">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 10v3h10V3h-3"/><path d="M6 10l4-4M10 6V3H7"/></svg>
          Quick start
        </a>
        <a href="https://github.com/fnzip/meowgpt" class="btn-secondary">View on GitHub</a>
      </div>
    </section>

    <section class="workbench" id="install">
      <div class="workbench-section">
        <div class="workbench-label">01 — Install</div>
        <h2>One command, zero config</h2>
        <p>MeowGPT runs on Bun. Install it, start it, and you're ready to go. No API keys, no database, no external services.</p>
        <div class="code-frame">
          <div class="code-frame-header">
            <span class="code-frame-dot"></span><span class="code-frame-dot"></span><span class="code-frame-dot"></span>
            <span class="code-frame-label">terminal</span>
          </div>
          <div class="code-frame-body"><pre>$ bun add meowgpt
$ meowgpt serve

🐱 MeowGPT server running at http://localhost:8787</pre></div>
        </div>
      </div>

      <div class="workbench-section" id="usage">
        <div class="workbench-label">02 — Chat</div>
        <h2>Drop-in replacement for OpenAI chat</h2>
        <p>Use the OpenAI SDK as you normally would. Change the baseURL and everything else stays the same.</p>
        <div class="code-frame">
          <div class="code-frame-header">
            <span class="code-frame-dot"></span><span class="code-frame-dot"></span><span class="code-frame-dot"></span>
            <span class="code-frame-label">chat.ts</span>
          </div>
          <div class="code-frame-body"><pre>import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "meow",
  baseURL: "http://localhost:8787/v1",
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
      </div>

      <div class="workbench-section">
        <div class="workbench-label">03 — Streaming</div>
        <h2>Server-Sent Events, just like OpenAI</h2>
        <p>Streaming works out of the box. Same SDK, same API, same chunk format.</p>
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
        <div class="workbench-label">04 — Images</div>
        <h2>Mock image generation</h2>
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
        <div class="workbench-label">05 — curl</div>
        <h2>Works with any HTTP client</h2>
        <p>No SDK required. MeowGPT speaks plain HTTP. Use curl, fetch, or any HTTP library.</p>
        <div class="code-frame">
          <div class="code-frame-header">
            <span class="code-frame-dot"></span><span class="code-frame-dot"></span><span class="code-frame-dot"></span>
            <span class="code-frame-label">terminal</span>
          </div>
          <div class="code-frame-body"><pre>$ curl http://localhost:8787/v1/models

{
  "object": "list",
  "data": [{ "id": "meowgpt", "object": "model", "owned_by": "meowgpt" }]
}

$ curl http://localhost:8787/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{"model":"meowgpt","messages":[{"role":"user","content":"hello"}]}'

{
  "id": "chatcmpl_mock",
  "choices": [{ "message": { "content": "Meow meow 🐱" } }]
}</pre></div>
        </div>
      </div>
    </section>

    <section class="workbench" id="api">
      <div class="workbench-section">
        <div class="workbench-label">API Reference</div>
        <h2>Endpoints</h2>
        <p>Three endpoints, all OpenAI-compatible. More coming soon.</p>
        <div class="sdk-grid">
          <div class="sdk-card">
            <h3><span style="color:var(--color-accent)">GET</span> /v1/models</h3>
            <p>List available models. Returns deterministic mock data.</p>
          </div>
          <div class="sdk-card">
            <h3><span style="color:var(--color-accent)">POST</span> /v1/chat/completions</h3>
            <p>Chat completions with streaming support. Validates with Zod.</p>
          </div>
          <div class="sdk-card">
            <h3><span style="color:var(--color-accent)">POST</span> /v1/images/generations</h3>
            <p>Image generation. Returns URL or base64 SVG. Supports n, size, quality.</p>
          </div>
          <div class="sdk-card">
            <h3>🔜 /v1/embeddings</h3>
            <p>Coming soon. Mock embedding vectors for RAG testing.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-strip">
      <h2>Ready to stop hitting real APIs in tests?</h2>
      <p>MeowGPT is free, open source, and takes 30 seconds to set up.</p>
      <a href="#install" class="btn-primary">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 10v3h10V3h-3"/><path d="M6 10l4-4M10 6V3H7"/></svg>
        Get started
      </a>
    </section>
  </main>

  <footer class="footer">
    <div class="footer-inner">
      <span class="footer-brand">🐱 MeowGPT</span>
      <span class="footer-tagline">Not affiliated with or provided by OpenAI.</span>
      <span class="footer-credit">MIT License · <a href="https://github.com/fnzip/meowgpt" style="color:var(--color-ink-faint)">GitHub</a></span>
    </div>
  </footer>
</body>
</html>`;
}
