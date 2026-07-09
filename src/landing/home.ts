import { layout } from "./layout";

export function renderHome(): string {
  return layout(
    "OpenAI-compatible mock server",
    `
    <section class="hero">
      <div class="hero-badge">v0.1.0</div>
      <h1>An OpenAI-compatible<br /><em>mock server</em> for dev &amp; test</h1>
      <p class="hero-lede">Point any OpenAI SDK at MeowGPT by changing only the <code>baseURL</code>. Deterministic responses, zero config, cold start in milliseconds. Built for SDK testing, CI pipelines, and agent development.</p>
      <div class="hero-actions">
        <a href="/install" class="btn-primary">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 10v3h10V3h-3"/><path d="M6 10l4-4M10 6V3H7"/></svg>
          Quick start
        </a>
        <a href="https://github.com/fnzip/meowgpt" class="btn-secondary">View on GitHub</a>
      </div>
    </section>

    <section class="page-grid">
      <a href="/install" class="page-card">
        <div class="page-card-label">01</div>
        <h2>Install</h2>
        <p>One command. Zero config. Runs on Bun, works on Cloudflare Workers.</p>
        <span class="page-card-arrow">→</span>
      </a>
      <a href="/usage" class="page-card">
        <div class="page-card-label">02</div>
        <h2>Usage</h2>
        <p>Chat, streaming, images. Drop-in replacement for the OpenAI SDK.</p>
        <span class="page-card-arrow">→</span>
      </a>
      <a href="/api" class="page-card">
        <div class="page-card-label">03</div>
        <h2>API Reference</h2>
        <p>Endpoints, request schemas, error codes. All OpenAI-compatible.</p>
        <span class="page-card-arrow">→</span>
      </a>
    </section>

    <section class="cta-strip">
      <h2>Ready to stop hitting real APIs in tests?</h2>
      <p>MeowGPT is free, open source, and takes 30 seconds to set up.</p>
      <a href="/install" class="btn-primary">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 10v3h10V3h-3"/><path d="M6 10l4-4M10 6V3H7"/></svg>
        Get started
      </a>
    </section>
    `,
    "/"
  );
}
