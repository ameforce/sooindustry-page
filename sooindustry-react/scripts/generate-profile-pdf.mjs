import { spawn } from "node:child_process";
import { constants } from "node:fs";
import { access, copyFile, mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createPagesPreview } from "../tests/static-server.mjs";

const appRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const finalPdf = resolve(appRoot, "public/sooin.pdf");
const temporaryPdf = resolve(appRoot, "public/sooin.generated.pdf");
const browser = await findBrowser();
const profileDir = await mkdtemp(join(tmpdir(), "sooin-profile-"));
const server = createPagesPreview(resolve(appRoot, "out"));

try {
  await new Promise((resolveListen, rejectListen) => {
    server.once("error", rejectListen);
    server.listen(0, "127.0.0.1", resolveListen);
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("정적 프리뷰 포트를 확인할 수 없습니다.");
  const url = `http://127.0.0.1:${address.port}/company-profile/`;

  const result = await runBrowser(browser, [
    "--headless=new",
    "--disable-gpu",
    "--disable-extensions",
    "--no-default-browser-check",
    "--no-first-run",
    `--user-data-dir=${profileDir}`,
    `--print-to-pdf=${temporaryPdf}`,
    "--no-pdf-header-footer",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=8000",
    url,
  ]);

  if (result.code !== 0) {
    throw new Error(`브라우저 PDF 생성 실패 (${result.code}): ${result.stderr.toString("utf8").slice(-2000)}`);
  }

  const [header, details] = await Promise.all([readFile(temporaryPdf), stat(temporaryPdf)]);
  if (!header.subarray(0, 5).equals(Buffer.from("%PDF-")) || details.size < 100_000) {
    throw new Error(`생성된 PDF 검증 실패: ${details.size} bytes`);
  }

  await copyFile(temporaryPdf, finalPdf);
  process.stdout.write(
    `${JSON.stringify({ browser, bytes: details.size, output: finalPdf, source: url })}\n`,
  );
} finally {
  await new Promise((resolveClose) => server.close(resolveClose));
  await rm(temporaryPdf, { force: true });
  await rm(profileDir, { recursive: true, force: true });
}

async function findBrowser() {
  const candidates = [
    process.env.BROWSER_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      await access(candidate, constants.X_OK);
      return candidate;
    } catch {
      // Try the next supported local Chromium browser.
    }
  }
  throw new Error("Chrome 또는 Edge 실행 파일을 찾지 못했습니다. BROWSER_PATH를 지정해 주세요.");
}

function runBrowser(executable, args) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(executable, args, { stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
    const stdout = [];
    const stderr = [];
    const timer = setTimeout(() => child.kill(), 45_000);

    child.stdout.on("data", (chunk) => stdout.push(Buffer.from(chunk)));
    child.stderr.on("data", (chunk) => stderr.push(Buffer.from(chunk)));
    child.once("error", rejectRun);
    child.once("close", (code) => {
      clearTimeout(timer);
      resolveRun({ code, stdout: Buffer.concat(stdout), stderr: Buffer.concat(stderr) });
    });
  });
}
