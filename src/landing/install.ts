import { layout } from "./layout";

export function renderInstall(): string {
  return layout(
    "Install",
    `
    <section class="page-hero">
      <div class="workbench-label">01 — Install</div>
      <h1>One command, zero config</h1>
      <p class="hero-lede">MeowGPT runs on Bun. Install it, start it, and you're ready to go. No API keys, no database, no external services.</p>
    </section>

    <section class="workbench">
      <div class="workbench-section">
        <div class="code-frame">
          <div class="code-frame-header">
            <span class="code-frame-dot"></span><span class="code-frame-dot"></span><span class="code-frame-dot"></span>
            <span class="code-frame-label">terminal</span>
          </div>
          <div class="code-frame-body"><pre>$ bun add meowgpt
$ meowgpt

    /\\_/\\
   ( o.o )   🐱  MeowGPT
    > ^ <     OpenAI-compatible mock server

  Server running at:  http://localhost:8787/v1</pre></div>
        </div>
      </div>

      <div class="workbench-section">
        <h2>CLI options</h2>
        <p>Customize host and port, or check the version.</p>
        <div class="code-frame">
          <div class="code-frame-header">
            <span class="code-frame-dot"></span><span class="code-frame-dot"></span><span class="code-frame-dot"></span>
            <span class="code-frame-label">terminal</span>
          </div>
          <div class="code-frame-body"><pre>$ meowgpt --host 0.0.0.0 --port 8080
$ meowgpt -v
0.1.1
$ meowgpt -h
🐱 MeowGPT — OpenAI-compatible mock server

Usage:
  meowgpt [options]
  meowgpt -h, --help
  meowgpt -v, --version</pre></div>
        </div>
      </div>

      <div class="workbench-section">
        <h2>Cloudflare Workers</h2>
        <p>Deploy to Cloudflare with a single command. The same codebase runs locally and on the edge.</p>
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
