import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import {
  buildQuickTunnelArgs,
  collectReferencedAssets,
  parsePreviewArgs,
  startQuickTunnel,
} from "../scripts/mobile-preview.mjs";

test("Quick Tunnel uses HTTP/2 over IPv4 to avoid blocked QUIC and IPv6 paths", () => {
  assert.deepEqual(buildQuickTunnelArgs("http://127.0.0.1:4173/", ["fixture"]), [
    "fixture",
    "tunnel",
    "--url",
    "http://127.0.0.1:4173/",
    "--protocol",
    "http2",
    "--edge-ip-version",
    "4",
    "--no-autoupdate",
    "--loglevel",
    "info",
  ]);
});

test("mobile preview is local-first and HTTPS is explicit", () => {
  assert.deepEqual(parsePreviewArgs([]), {
    cloudflaredPath: null,
    https: false,
    openBrowser: true,
    port: 4173,
  });
  assert.equal(parsePreviewArgs(["--https"]).https, true);
  assert.equal(parsePreviewArgs(["--no-open"]).openBrowser, false);
  assert.equal(parsePreviewArgs(["--port", "4317"]).port, 4317);
  assert.equal(
    parsePreviewArgs(["--cloudflared", "C:/tools/cloudflared.exe"]).cloudflaredPath,
    "C:/tools/cloudflared.exe",
  );
});

test("mobile preview launcher avoids PowerShell process orchestration", async () => {
  const source = await readFile(resolve(import.meta.dirname, "../scripts/mobile-preview.mjs"), "utf8");

  assert.doesNotMatch(source, /Start-Process|powershell(?:\.exe)?/i);
  assert.match(source, /spawn\(/);
});

test("mobile preview discovers page and stylesheet assets without duplicates", () => {
  const html = `
    <link rel="stylesheet" href="/_next/site.css">
    <script src="/_next/app.js"></script>
    <img src="/img/machine.webp">
    <source srcset="/img/machine.webp 1x, /img/machine@2x.webp 2x">
  `;
  const css = `
    @font-face { src: url('/fonts/pretendard.woff2') format('woff2'); }
    .hero { background-image: url("/img/machine.webp"); }
  `;

  assert.deepEqual(
    [...collectReferencedAssets(html, "text/html", "https://example.test/")].sort(),
    [
      "https://example.test/_next/app.js",
      "https://example.test/_next/site.css",
      "https://example.test/img/machine.webp",
      "https://example.test/img/machine@2x.webp",
    ],
  );
  assert.deepEqual(
    [...collectReferencedAssets(css, "text/css", "https://example.test/_next/site.css")].sort(),
    [
      "https://example.test/fonts/pretendard.woff2",
      "https://example.test/img/machine.webp",
    ],
  );
});

test("Quick Tunnel uses a directly spawned executable and captures its URL", async () => {
  const fixtureRoot = await mkdtemp(join(tmpdir(), "sooin-cloudflared-fixture-"));
  const logPath = join(fixtureRoot, "cloudflared.log");
  const expectedUrl = "https://deterministic-mobile-preview.trycloudflare.com";
  const startedAt = Date.now();
  let tunnel;

  try {
    tunnel = await startQuickTunnel(process.execPath, "http://127.0.0.1:4173/", logPath, {
      prefixArgs: [
        "--eval",
        `process.stderr.write(${JSON.stringify(expectedUrl)} + "\\n"); setTimeout(() => process.stderr.write("Registered tunnel connection\\n"), 50); setInterval(() => {}, 1000);`,
        "--",
      ],
    });
    assert.equal(tunnel.url, expectedUrl);
    assert.ok(Date.now() - startedAt >= 40, "URL announcement alone must not mark the tunnel ready");
  } finally {
    tunnel?.close();
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 50));
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

test("failed Quick Tunnel startup exits promptly and releases its log", async () => {
  const fixtureRoot = await mkdtemp(join(tmpdir(), "sooin-cloudflared-failure-"));
  const logPath = join(fixtureRoot, "cloudflared.log");
  const startedAt = Date.now();

  try {
    await assert.rejects(
      startQuickTunnel(process.execPath, "http://127.0.0.1:4173/", logPath, {
        prefixArgs: ["--eval", "process.stderr.write('fixture failure\\n'); process.exit(23);", "--"],
      }),
      /exit 23/,
    );
    assert.ok(Date.now() - startedAt < 2_000, "startup failure should not wait for the 45 second timeout");
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});
