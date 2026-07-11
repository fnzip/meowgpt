/** @jsxImportSource hono/jsx */
import { Hono } from "hono";
import { setupAPIRoutes, setupAPICatchAll } from "../src/routes/api";
import { renderHome } from "../src/landing/home";
import { renderInstall } from "../src/landing/install";
import { renderUsage } from "../src/landing/usage";
import { renderApi } from "../src/landing/api";
import { TOKENS_CSS } from "../src/landing/tokens-css";

const app = new Hono();

// Landing pages
app.get("/", (c) => c.html(renderHome()));
app.get("/install", (c) => c.html(renderInstall()));
app.get("/usage", (c) => c.html(renderUsage()));
app.get("/api", (c) => c.html(renderApi()));

// Static CSS for landing
app.get("/landing/tokens.css", (c) => {
  return new Response(TOKENS_CSS, {
    headers: { "Content-Type": "text/css; charset=utf-8" },
  });
});

// API routes + catch-all
setupAPIRoutes(app);
setupAPICatchAll(app);

export default app;
