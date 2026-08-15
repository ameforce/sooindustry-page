import { createServer } from "node:http";
import { readFileSync, statSync } from "node:fs";
import { extname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const defaultRoot = resolve(fileURLToPath(new URL("../out", import.meta.url)));
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

function readRules(root, name) {
  try {
    return readFileSync(resolve(root, name), "utf8");
  } catch {
    return "";
  }
}

function parseGlobalHeaders(source) {
  const lines = source.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === "/*");
  if (start < 0) return {};

  return Object.fromEntries(
    lines
      .slice(start + 1)
      .filter((line) => /^\s+[^:]+:/.test(line))
      .map((line) => {
        const separator = line.indexOf(":");
        return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
      }),
  );
}

function parseLocalRedirects(source) {
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.startsWith("/"))
    .map((line) => {
      const [from, to, status = "302"] = line.split(/\s+/);
      return { from, to, status: Number(status) };
    });
}

function resolveAsset(root, pathname) {
  const decoded = decodeURIComponent(pathname);
  const relativePath = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  const candidates = [relativePath, `${relativePath}.html`, `${relativePath.replace(/\/$/, "")}/index.html`];

  for (const candidate of candidates) {
    const absolute = resolve(root, candidate);
    const relativeToRoot = relative(root, absolute);
    if (relativeToRoot.startsWith("..") || isAbsolute(relativeToRoot)) continue;
    try {
      if (statSync(absolute).isFile()) return absolute;
    } catch {
      // Try the next static-export filename shape.
    }
  }

  return null;
}

export function createPagesPreview(root = defaultRoot) {
  const headers = parseGlobalHeaders(readRules(root, "_headers"));
  const redirects = parseLocalRedirects(readRules(root, "_redirects"));

  return createServer((request, response) => {
    const url = new URL(request.url ?? "/", "http://localhost");
    const redirect = redirects.find((rule) => rule.from === url.pathname);
    if (redirect) {
      response.writeHead(redirect.status, { Location: redirect.to });
      response.end();
      return;
    }

    const asset = resolveAsset(root, url.pathname);
    const file = asset ?? resolve(root, "404.html");
    const status = asset ? 200 : 404;
    const body = readFileSync(file);
    response.writeHead(status, {
      ...headers,
      "Content-Type": contentTypes[extname(file).toLowerCase()] ?? "application/octet-stream",
    });
    response.end(request.method === "HEAD" ? undefined : body);
  });
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const port = Number(process.env.PORT ?? 3000);
  createPagesPreview().listen(port, "127.0.0.1", () => {
    process.stdout.write(`Static export preview: http://127.0.0.1:${port}\n`);
  });
}
