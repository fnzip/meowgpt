import { layout } from "./layout";

export function renderApi(): string {
  return layout(
    "API Reference",
    `
    <section class="page-hero">
      <div class="workbench-label">03 — API Reference</div>
      <h1>Endpoints</h1>
      <p class="hero-lede">Three endpoints, all OpenAI-compatible. Request validation via Zod. OpenAI-style error responses.</p>
    </section>

    <section class="workbench">
      <div class="workbench-section">
        <h2><span class="method-get">GET</span> /v1/models</h2>
        <p>List available models. Returns deterministic mock data.</p>
        <div class="code-frame">
          <div class="code-frame-header">
            <span class="code-frame-dot"></span><span class="code-frame-dot"></span><span class="code-frame-dot"></span>
            <span class="code-frame-label">terminal</span>
          </div>
          <div class="code-frame-body"><pre>$ curl https://meowgpt.alfian.dev/v1/models</pre></div>
        </div>
        <div class="response-block">
          <div class="response-block-label">200 OK</div>
          <pre>{
  "object": "list",
  "data": [
    {
      "id": "meowgpt",
      "object": "model",
      "owned_by": "meowgpt"
    }
  ]
}</pre>
        </div>
      </div>

      <div class="workbench-section">
        <h2><span class="method-post">POST</span> /v1/chat/completions</h2>
        <p>Chat completions with streaming support. Validates request body with Zod.</p>

        <h3>Request</h3>
        <div class="code-frame">
          <div class="code-frame-header">
            <span class="code-frame-dot"></span><span class="code-frame-dot"></span><span class="code-frame-dot"></span>
            <span class="code-frame-label">json</span>
          </div>
          <div class="code-frame-body"><pre>{
  "model": "meowgpt",            // required
  "messages": [                  // required, min 1
    { "role": "user", "content": "hello" }
  ],
  "stream": false,               // optional, default false
  "temperature": 0.7,            // optional
  "max_tokens": 256,             // optional
  "delay_ms": 300                // optional, 0-10000. Simulates thinking delay
}</pre></div>
        </div>

        <p><code>delay_ms</code> controls response latency. Default 300ms. Set to 0 for instant responses in CI. In streaming mode, chunk delay = <code>delay_ms / 4</code> per token with jitter.</p>

        <h3>Response</h3>
        <div class="response-block">
          <div class="response-block-label">200 OK</div>
          <pre>{
  "id": "chatcmpl_mock",
  "object": "chat.completion",
  "created": 123456789,
  "model": "meowgpt",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Meow meow 🐱"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 2,
    "completion_tokens": 3,
    "total_tokens": 5
  }
}</pre>
        </div>

        <h3>Streaming</h3>
        <p>Set <code>"stream": true</code> to receive Server-Sent Events.</p>
        <div class="response-block">
          <div class="response-block-label">200 OK (text/event-stream)</div>
          <pre>data: {"id":"chatcmpl_mock","object":"chat.completion.chunk","created":123456789,"model":"meowgpt","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl_mock","object":"chat.completion.chunk","created":123456789,"model":"meowgpt","choices":[{"index":0,"delta":{"content":"Meow"},"finish_reason":null}]}

data: {"id":"chatcmpl_mock","object":"chat.completion.chunk","created":123456789,"model":"meowgpt","choices":[{"index":0,"delta":{"content":" meow"},"finish_reason":null}]}

data: {"id":"chatcmpl_mock","object":"chat.completion.chunk","created":123456789,"model":"meowgpt","choices":[{"index":0,"delta":{"content":" 🐱"},"finish_reason":null}]}

data: {"id":"chatcmpl_mock","object":"chat.completion.chunk","created":123456789,"model":"meowgpt","choices":[{"index":0,"delta":{},"finish_reason":"stop"}],"usage":{"prompt_tokens":2,"completion_tokens":3,"total_tokens":5}}

data: [DONE]</pre>
        </div>

        <h3>Errors</h3>
        <div class="response-block">
          <div class="response-block-label">400 Bad Request</div>
          <pre>{
  "error": {
    "message": "model: Required; messages: Required",
    "type": "invalid_request_error",
    "code": "invalid_parameters"
  }
}</pre>
        </div>
      </div>

      <div class="workbench-section">
        <h2><span class="method-post">POST</span> /v1/images/generations</h2>
        <p>Image generation. Returns URL or base64 SVG. Supports n, size, quality, style.</p>

        <h3>Request</h3>
        <div class="code-frame">
          <div class="code-frame-header">
            <span class="code-frame-dot"></span><span class="code-frame-dot"></span><span class="code-frame-dot"></span>
            <span class="code-frame-label">json</span>
          </div>
          <div class="code-frame-body"><pre>{
  "prompt": "a cat",             // required
  "model": "meowgpt",            // optional
  "n": 1,                        // optional, 1-10
  "size": "1024x1024",           // optional
  "response_format": "url",      // optional, "url" | "b64_json"
  "quality": "standard",         // optional
  "style": "vivid"               // optional
}</pre></div>
        </div>

        <h3>Response</h3>
        <div class="response-block">
          <div class="response-block-label">200 OK</div>
          <pre>{
  "created": 123456789,
  "data": [
    {
      "url": "https://meowgpt.dev/mock-image.png",
      "revised_prompt": "a cat"
    }
  ]
}</pre>
        </div>
      </div>

      <div class="workbench-section">
        <h2>Error codes</h2>
        <div class="sdk-grid">
          <div class="sdk-card">
            <h3>400</h3>
            <p>Invalid request body or parameters. Check the error message for details.</p>
          </div>
          <div class="sdk-card">
            <h3>404</h3>
            <p>Route not found. Verify the path and method.</p>
          </div>
          <div class="sdk-card">
            <h3>405</h3>
            <p>Method not allowed on this endpoint.</p>
          </div>
          <div class="sdk-card">
            <h3>500</h3>
            <p>Internal server error. Check server logs.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="page-nav">
      <a href="/usage" class="btn-secondary">← Usage</a>
      <a href="/" class="btn-primary">Home</a>
    </section>
    `,
    "/api"
  );
}
