export function layout(title: string, body: string, currentPage: string): string {
  const navLink = (href: string, label: string) =>
    `<li><a href="${href}"${currentPage === href ? ' class="active"' : ""}>${label}</a></li>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — MeowGPT</title>
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
      ${navLink("/install", "Install")}
      ${navLink("/usage", "Usage")}
      ${navLink("/api", "API")}
      <li><a href="https://github.com/fnzip/meowgpt">GitHub</a></li>
    </ul>
    <a href="/install" class="nav-cta">Get started</a>
  </nav>

  <main>
    ${body}
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
