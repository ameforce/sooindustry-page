import { spawn, spawnSync } from "node:child_process";
import { createWriteStream, existsSync } from "node:fs";
import { access, mkdir } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import QRCode from "qrcode";
import { createPagesPreview } from "../tests/static-server.mjs";

const appRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outputRoot = resolve(appRoot, "output/mobile-preview");
const tunnelPattern = /https:\/\/[a-z0-9-]+\.trycloudflare\.com/gi;

export function parsePreviewArgs(argv) {
  const options = {
    cloudflaredPath: null,
    https: false,
    openBrowser: true,
    port: 4173,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--https") {
      options.https = true;
    } else if (argument === "--no-open") {
      options.openBrowser = false;
    } else if (argument === "--port") {
      const value = Number(argv[index + 1]);
      if (!Number.isInteger(value) || value < 1 || value > 65_535) {
        throw new Error("--port에는 1~65535 범위의 정수를 지정해야 합니다.");
      }
      options.port = value;
      index += 1;
    } else if (argument === "--cloudflared") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error("--cloudflared 뒤에 실행 파일 경로를 지정해야 합니다.");
      }
      options.cloudflaredPath = value;
      index += 1;
    } else if (argument === "--help" || argument === "-h") {
      options.help = true;
    } else {
      throw new Error(`지원하지 않는 옵션입니다: ${argument}`);
    }
  }

  return options;
}

function toResourceUrl(value, baseUrl) {
  if (!value || value.startsWith("#") || /^(?:data|blob|mailto|tel|javascript):/i.test(value)) return null;
  try {
    const url = new URL(value, baseUrl);
    return /^https?:$/.test(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function readAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match?.[1] ?? null;
}

export function collectReferencedAssets(content, contentType, baseUrl) {
  const assets = new Set();
  const add = (value) => {
    const url = toResourceUrl(value, baseUrl);
    if (url) assets.add(url);
  };

  if (contentType.includes("text/html")) {
    for (const match of content.matchAll(/<(link|script|img|source|video|audio)\b[^>]*>/gi)) {
      const [tag, rawName] = match;
      const name = rawName.toLowerCase();
      if (name === "link") {
        const rel = (readAttribute(tag, "rel") ?? "").toLowerCase().split(/\s+/);
        if (rel.some((value) => ["stylesheet", "icon", "preload", "modulepreload", "manifest"].includes(value))) {
          add(readAttribute(tag, "href"));
        }
      } else {
        add(readAttribute(tag, "src"));
        add(readAttribute(tag, "poster"));
        const srcset = readAttribute(tag, "srcset");
        if (srcset) {
          for (const candidate of srcset.split(",")) add(candidate.trim().split(/\s+/)[0]);
        }
      }
    }
  }

  if (contentType.includes("text/css")) {
    for (const match of content.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) add(match[1]);
    for (const match of content.matchAll(/@import\s+(?:url\()?\s*["']([^"']+)["']/gi)) add(match[1]);
  }

  return assets;
}

export async function verifyAssetGraph(origin, { concurrency = 16, fetchImpl = fetch } = {}) {
  const startUrl = new URL("/", origin).href;
  const pending = [startUrl];
  const seen = new Set(pending);
  const results = [];

  while (pending.length > 0) {
    const batch = pending.splice(0, concurrency);
    const responses = await Promise.all(
      batch.map(async (url) => {
        const response = await fetchImpl(url, {
          redirect: "follow",
          signal: AbortSignal.timeout(15_000),
        });
        const contentType = response.headers.get("content-type") ?? "";
        const body = /text\/(?:html|css)/i.test(contentType) ? await response.text() : null;
        return { body, contentType, response, url };
      }),
    );

    for (const item of responses) {
      results.push({ status: item.response.status, url: item.url });
      if (item.response.status !== 200) continue;
      if (item.body === null) continue;
      for (const assetUrl of collectReferencedAssets(item.body, item.contentType, item.response.url || item.url)) {
        if (seen.has(assetUrl)) continue;
        seen.add(assetUrl);
        pending.push(assetUrl);
      }
    }
  }

  const failures = results.filter((result) => result.status !== 200);
  if (failures.length > 0) {
    throw new Error(`200 응답이 아닌 프리뷰 리소스가 있습니다: ${JSON.stringify(failures)}`);
  }
  return results;
}

function executableFromPath(command) {
  const locator = process.platform === "win32" ? "where.exe" : "which";
  const located = spawnSync(locator, [command], {
    encoding: "utf8",
    shell: false,
    windowsHide: true,
  });
  if (located.status !== 0) return null;
  return located.stdout.split(/\r?\n/).map((line) => line.trim()).find(Boolean) ?? null;
}

export function resolveCloudflaredPath(preferredPath = null) {
  const candidates = [
    preferredPath,
    process.env.CLOUDFLARED_PATH,
    executableFromPath("cloudflared"),
    process.platform === "win32" && process.env.LOCALAPPDATA
      ? join(process.env.LOCALAPPDATA, "Microsoft/WinGet/Links/cloudflared.exe")
      : null,
  ].filter(Boolean);

  const executable = candidates.find((candidate) => existsSync(resolve(candidate)));
  if (!executable) {
    throw new Error(
      "cloudflared를 찾을 수 없습니다. PATH에 추가하거나 --cloudflared <실행 파일> 또는 CLOUDFLARED_PATH를 지정하세요.",
    );
  }
  return resolve(executable);
}

function browserLaunch() {
  if (process.platform === "win32") {
    const candidates = [
      process.env.LOCALAPPDATA && join(process.env.LOCALAPPDATA, "Google/Chrome/Application/chrome.exe"),
      process.env.PROGRAMFILES && join(process.env.PROGRAMFILES, "Google/Chrome/Application/chrome.exe"),
      process.env["PROGRAMFILES(X86)"] && join(process.env["PROGRAMFILES(X86)"], "Google/Chrome/Application/chrome.exe"),
      process.env.PROGRAMFILES && join(process.env.PROGRAMFILES, "Microsoft/Edge/Application/msedge.exe"),
      process.env["PROGRAMFILES(X86)"] && join(process.env["PROGRAMFILES(X86)"], "Microsoft/Edge/Application/msedge.exe"),
    ].filter(Boolean);
    const executable = candidates.find((candidate) => existsSync(candidate));
    if (!executable) throw new Error("Chrome 또는 Edge 실행 파일을 찾을 수 없습니다. --no-open으로 자동 열기를 생략할 수 있습니다.");
    return { args: [], command: executable };
  }
  if (process.platform === "darwin") return { args: ["-a", "Google Chrome"], command: "open" };
  return { args: [], command: "xdg-open" };
}

export function openVisibleBrowser(url) {
  const launch = browserLaunch();
  const child = spawn(launch.command, [...launch.args, url], {
    detached: true,
    shell: false,
    stdio: "ignore",
    windowsHide: false,
  });
  child.unref();
}

/**
 * @param {string} cloudflaredPath
 * @param {string} localUrl
 * @param {string} logPath
 * @param {{ prefixArgs?: string[], spawnImpl?: typeof spawn }} [options]
 */
export async function startQuickTunnel(
  cloudflaredPath,
  localUrl,
  logPath,
  { prefixArgs = [], spawnImpl = spawn } = {},
) {
  await mkdir(dirname(logPath), { recursive: true });
  const log = createWriteStream(logPath, { flags: "w", encoding: "utf8" });
  const child = spawnImpl(
    cloudflaredPath,
    [...prefixArgs, "tunnel", "--url", localUrl, "--no-autoupdate", "--loglevel", "info"],
    {
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    },
  );
  child.stdout.pipe(log, { end: false });
  child.stderr.pipe(log, { end: false });

  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    child.stdout.unpipe(log);
    child.stderr.unpipe(log);
    if (!child.killed) child.kill();
    log.end();
  };

  let url;
  try {
    url = await new Promise((resolveUrl, rejectUrl) => {
      let output = "";
      let settled = false;
      const finish = (callback, value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        callback(value);
      };
      const inspect = (chunk) => {
        output = `${output}${chunk}`.slice(-32_768);
        const match = output.match(tunnelPattern)?.at(-1);
        if (match) finish(resolveUrl, match);
      };
      child.stdout.on("data", inspect);
      child.stderr.on("data", inspect);
      child.once("error", (error) => finish(rejectUrl, error));
      child.once("exit", (code) => {
        if (!settled) finish(rejectUrl, new Error(`cloudflared가 URL 생성 전에 종료되었습니다 (exit ${code}). 로그: ${logPath}`));
      });
      const timer = setTimeout(() => {
        cleanup();
        finish(rejectUrl, new Error(`45초 안에 Quick Tunnel URL을 확인하지 못했습니다. 로그: ${logPath}`));
      }, 45_000);
    });
  } catch (error) {
    cleanup();
    throw error;
  }

  return {
    child,
    close: cleanup,
    url,
  };
}

async function waitForVerifiedPreview(origin) {
  let latestError;
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      return await verifyAssetGraph(origin);
    } catch (error) {
      latestError = error;
      if (attempt < 6) await new Promise((resolveDelay) => setTimeout(resolveDelay, attempt * 500));
    }
  }
  throw latestError;
}

function listen(server, port) {
  return new Promise((resolveListen, rejectListen) => {
    server.once("error", rejectListen);
    server.listen(port, "127.0.0.1", () => resolveListen());
  });
}

function closeServer(server) {
  return new Promise((resolveClose) => server.close(resolveClose));
}

function waitForShutdown() {
  return new Promise((resolveShutdown) => {
    const finish = () => resolveShutdown();
    process.once("SIGINT", finish);
    process.once("SIGTERM", finish);
  });
}

function printUsage() {
  process.stdout.write(`Usage: node scripts/mobile-preview.mjs [options]\n\n`);
  process.stdout.write(`  --https                 Start an ephemeral Cloudflare Quick Tunnel\n`);
  process.stdout.write(`  --cloudflared <path>    Use an explicit cloudflared executable\n`);
  process.stdout.write(`  --port <number>         Local port (default: 4173)\n`);
  process.stdout.write(`  --no-open               Do not open the visible local browser\n`);
}

export async function main(argv = process.argv.slice(2)) {
  const options = parsePreviewArgs(argv);
  if (options.help) {
    printUsage();
    return;
  }

  await access(resolve(appRoot, "out/index.html"));
  await mkdir(outputRoot, { recursive: true });
  const server = createPagesPreview(resolve(appRoot, "out"));
  let tunnel = null;
  try {
    await listen(server, options.port);
    const localUrl = `http://127.0.0.1:${options.port}/`;
    if (options.openBrowser) openVisibleBrowser(localUrl);
    const localAssets = await verifyAssetGraph(localUrl);
    process.stdout.write(`LOCAL_PREVIEW_READY ${localUrl} assets=${localAssets.length}\n`);

    if (options.https) {
      const cloudflaredPath = resolveCloudflaredPath(options.cloudflaredPath);
      const logPath = resolve(outputRoot, "cloudflared.log");
      tunnel = await startQuickTunnel(cloudflaredPath, localUrl, logPath);
      const publicAssets = await waitForVerifiedPreview(tunnel.url);
      const qrPath = resolve(outputRoot, "mobile-preview-qr.png");
      await QRCode.toFile(qrPath, tunnel.url, { errorCorrectionLevel: "M", margin: 2, width: 512 });
      process.stdout.write(`HTTPS_PREVIEW_READY ${tunnel.url} assets=${publicAssets.length}\n`);
      process.stdout.write(`QR_CODE ${qrPath}\n`);
      process.stdout.write(`CLOUDFLARED_LOG ${logPath}\n`);
      process.stdout.write("Quick Tunnel은 임시 검토 중계이며 Cloudflare Pages 배포나 DNS 변경을 수행하지 않습니다.\n");
    }

    process.stdout.write("종료하려면 Ctrl+C를 누르세요.\n");
    await waitForShutdown();
  } finally {
    tunnel?.close();
    if (server.listening) await closeServer(server);
  }
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main().catch((error) => {
    process.stderr.write(`${basename(process.argv[1])}: ${error.message}\n`);
    process.exitCode = 1;
  });
}
