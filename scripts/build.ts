#!/usr/bin/env bun

// Build script: compiles TS to JS for npm distribution + CF Pages
// Output: dist/ (npm), pages-dist/ (Cloudflare Pages)

// --- npm build ---
// Bundle CLI as standalone executable
const cliResult = await Bun.build({
  entrypoints: ["src/cli/index.ts"],
  outdir: "dist/cli",
  target: "bun",
  format: "esm",
  minify: false,
  sourcemap: "external",
  naming: "index.js",
});

if (!cliResult.success) {
  for (const log of cliResult.logs) console.error(log);
  process.exit(1);
}

// Bundle routes as library entry
const routesResult = await Bun.build({
  entrypoints: ["src/routes/index.ts"],
  outdir: "dist/routes",
  target: "bun",
  format: "esm",
  minify: false,
  sourcemap: "external",
  naming: "index.js",
});

if (!routesResult.success) {
  for (const log of routesResult.logs) console.error(log);
  process.exit(1);
}

// Copy landing CSS (static asset for npm)
await Bun.write("dist/landing/tokens.css", Bun.file("src/landing/tokens.css"));

// Copy package.json for npm publish (strip dev fields)
const pkg = await Bun.file("package.json").json();
delete pkg.scripts;
delete pkg.devDependencies;
delete pkg.peerDependencies;
await Bun.write("dist/package.json", JSON.stringify(pkg, null, 2) + "\n");

// Copy README
await Bun.write("dist/README.md", Bun.file("README.md"));

console.log("✓ dist/ built (npm)");

// --- CF Pages build ---
const pagesResult = await Bun.build({
  entrypoints: ["worker/index.ts"],
  outdir: "pages-dist",
  target: "bun",
  format: "esm",
  minify: true,
  naming: "_worker.js",
});

if (!pagesResult.success) {
  for (const log of pagesResult.logs) console.error(log);
  process.exit(1);
}

console.log("✓ pages-dist/ built (Cloudflare Pages)");
