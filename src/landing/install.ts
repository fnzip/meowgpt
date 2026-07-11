import { layout } from "./layout";

export function renderInstall(): string {
  return layout(
    "Install",
    `
    <section class="page-hero">
      <div class="workbench-label">01 — Install</div>
      <h1>One command, zero config</h1>
      <p class="hero-lede">MeowGPT runs on Bun. No install needed — just <code>bunx meowgpt</code>. Or add it to your project. No API keys, no database, no external services.</p>
    </section>

    <section class="workbench">
      <div class="workbench-section">
        <div class="code-frame">
          <div class="code-frame-header">
            <span class="code-frame-dot"></span><span class="code-frame-dot"></span><span class="code-frame-dot"></span>
            <span class="code-frame-label">terminal</span>
          </div>
          <div class="code-frame-body"><pre>$ bunx meowgpt

    /\\_/\\
   ( o.o )   🐱  MeowGPT
    > ^ <     OpenAI-compatible mock server

  Local:              http://localhost:8787/v1
  Hosted:             https://meowgpt.alfian.dev/v1

  Endpoints:
    GET  /v1/models
    POST /v1/chat/completions
    POST /v1/images/generations

  Use in your AI agent / OpenAI client:
    baseURL: "http://localhost:8787/v1"
    apiKey:  "meow" (any value works)</pre></div>
        </div>
      </div>

      <div class="workbench-section">
        <h2>Or add to your project</h2>
        <p>Install as a dev dependency for CI pipelines and local testing.</p>
        <div class="code-frame">
          <div class="code-frame-header">
            <span class="code-frame-dot"></span><span class="code-frame-dot"></span><span class="code-frame-dot"></span>
            <span class="code-frame-label">terminal</span>
          </div>
          <div class="code-frame-body"><pre>$ bun add -d meowgpt
$ bun meowgpt</pre></div>
        </div>
      </div>

      <div class="workbench-section">
        <h2>CLI options</h2>
        <p>Customize host and port, or check the version. No subcommands — just run it.</p>
        <div class="code-frame">
          <div class="code-frame-header">
            <span class="code-frame-dot"></span><span class="code-frame-dot"></span><span class="code-frame-dot"></span>
            <span class="code-frame-label">terminal</span>
          </div>
          <div class="code-frame-body"><pre>$ meowgpt --host 0.0.0.0 --port 8080
$ meowgpt -v
0.1.3
$ meowgpt -h
🐱 MeowGPT — OpenAI-compatible mock server

Usage:
  meowgpt [options]
  meowgpt -h, --help
  meowgpt -v, --version

Options:
  --host      Host to bind (default: localhost)
  --port      Port to bind (default: 8787)
  -h, --help  Show this help
  -v, --version  Show version</pre></div>
        </div>
      </div>

        <h2>No install? Use the hosted version</h2>
        <p>Point your OpenAI client at <code>https://meowgpt.alfian.dev/v1</code>. Always available, zero setup.</p>
        <div class="code-frame">
          <div class="code-frame-header">
            <span class="code-frame-dot"></span><span class="code-frame-dot"></span><span class="code-frame-dot"></span>
            <span class="code-frame-label">terminal</span>
          </div>
          <div class="code-frame-body"><pre>$ curl https://meowgpt.alfian.dev/v1/models</pre></div>
        </div>
      </div>

      <div class="workbench-section">
        <h2>Cloudflare Workers</h2>
        <p>Deploy your own instance to Cloudflare with a single command.</p>
        <div class="code-frame">
          <div class="code-frame-header">
            <span class="code-frame-dot"></span><span class="code-frame-dot"></span><span class="code-frame-dot"></span>
            <span class="code-frame-label">terminal</span>
          </div>
          <div class="code-frame-body"><pre>$ bun run deploy
# or
$ wrangler deploy</pre></div>
        </div>
      </div>
    </section>

    <section class="page-nav">
      <a href="/" class="btn-secondary">← Home</a>
      <a href="/usage" class="btn-primary">Usage →</a>
    </section>
    `,
    "/install"
  );
}
