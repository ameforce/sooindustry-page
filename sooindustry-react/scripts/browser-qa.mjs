import { spawn } from "node:child_process";
import { constants } from "node:fs";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createPagesPreview } from "../tests/static-server.mjs";

async function main() {
  const appRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
  const outputDir = resolve(appRoot, "output/browser-qa");
  const browser = await findBrowser();
  const profileDir = await mkdtemp(join(tmpdir(), "sooin-browser-qa-"));
  const server = createPagesPreview(resolve(appRoot, "out"));
  let browserProcess;

  try {
  await mkdir(outputDir, { recursive: true });
  await new Promise((resolveListen, rejectListen) => {
    server.once("error", rejectListen);
    server.listen(0, "127.0.0.1", resolveListen);
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("정적 프리뷰 포트를 확인할 수 없습니다.");
  const origin = `http://127.0.0.1:${address.port}/`;

  browserProcess = launchBrowser(browser, profileDir);
  const debugPort = await readDebugPort(profileDir);
  const target = await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: "PUT" }).then(
    (response) => response.json(),
  );
  const cdp = await CdpSession.connect(target.webSocketDebuggerUrl);
  await Promise.all([cdp.send("Page.enable"), cdp.send("Runtime.enable")]);

  const results = [];
  for (const width of [390, 768, 1024, 1440]) {
    const height = width <= 768 ? 844 : 900;
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width <= 768,
      screenWidth: width,
      screenHeight: height,
    });
    await navigate(cdp, origin);
    await delay(850);

    const layout = await evaluate(cdp, `(() => {
      const visibleHiddenReveals = [...document.querySelectorAll('[data-reveal]')].filter((node) => {
        const rect = node.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < innerHeight && getComputedStyle(node).opacity === '0';
      }).length;
      const menu = document.querySelector('button[aria-controls="primary-navigation"]');
      const navigation = document.querySelector('#primary-navigation');
      const equipmentHero = document.querySelector('[data-equipment-hero]');
      const equipmentHeroRect = equipmentHero.getBoundingClientRect();
      return {
        h1Count: document.querySelectorAll('h1').length,
        innerWidth,
        pageHeight: document.documentElement.scrollHeight,
        scrollWidth: document.documentElement.scrollWidth,
        horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
        primaryActionCount: document.querySelectorAll('[data-primary-action]').length,
        equipmentHeroVisible: equipmentHeroRect.top < innerHeight && equipmentHeroRect.bottom > 0,
        equipmentHeroTop: Math.round(equipmentHeroRect.top),
        missingImageAlt: [...document.images].filter((image) => !image.hasAttribute('alt')).length,
        brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).length,
        unlabelledFormControls: [...document.querySelectorAll('input, select, textarea')].filter(
          (control) => !control.labels || control.labels.length === 0,
        ).length,
        resourceBytes: Math.round(performance.getEntriesByType('resource').reduce((total, item) => total + (item.encodedBodySize || 0), 0)),
        visibleHiddenReveals,
        menuDisplay: getComputedStyle(menu).display,
        menuHeight: Math.round(menu.getBoundingClientRect().height),
        navigationVisibility: getComputedStyle(navigation).visibility,
      };
    })()`);

    if (
      layout.horizontalOverflow ||
      layout.h1Count !== 1 ||
      layout.primaryActionCount !== 1 ||
      layout.missingImageAlt !== 0 ||
      layout.brokenImages !== 0 ||
      layout.unlabelledFormControls !== 0 ||
      layout.visibleHiddenReveals !== 0
    ) {
      throw new Error(`레이아웃 검증 실패 (${width}px): ${JSON.stringify(layout)}`);
    }
    if (width <= 768 && layout.menuHeight < 44) throw new Error(`모바일 메뉴 터치 영역이 44px 미만입니다: ${width}px`);
    if (width === 390 && !layout.equipmentHeroVisible) {
      throw new Error(`390px 첫 화면에 실제 설비 이미지가 보이지 않습니다: ${JSON.stringify(layout)}`);
    }
    if (width === 390 && layout.pageHeight > 6_500) {
      throw new Error(`390px 페이지 길이가 모바일 목표를 초과합니다: ${layout.pageHeight}px`);
    }
    if (width > 860 && (layout.menuDisplay !== "none" || layout.navigationVisibility !== "visible")) {
      throw new Error(`데스크톱 내비게이션 검증 실패 (${width}px): ${JSON.stringify(layout)}`);
    }

    let menuInteraction = null;
    if (width <= 768) {
      await evaluate(cdp, `document.querySelector('button[aria-controls="primary-navigation"]').click()`);
      await delay(220);
      const opened = await evaluate(cdp, `(() => {
        const menu = document.querySelector('button[aria-controls="primary-navigation"]');
        const nav = document.querySelector('#primary-navigation');
        return { expanded: menu.getAttribute('aria-expanded'), visibility: getComputedStyle(nav).visibility };
      })()`);
      if (opened.expanded !== "true" || opened.visibility !== "visible") {
        throw new Error(`모바일 메뉴 열기 실패 (${width}px): ${JSON.stringify(opened)}`);
      }

      await cdp.send("Input.dispatchKeyEvent", {
        type: "keyDown",
        key: "Escape",
        code: "Escape",
        windowsVirtualKeyCode: 27,
        nativeVirtualKeyCode: 27,
      });
      await cdp.send("Input.dispatchKeyEvent", {
        type: "keyUp",
        key: "Escape",
        code: "Escape",
        windowsVirtualKeyCode: 27,
        nativeVirtualKeyCode: 27,
      });
      await delay(220);
      const closed = await evaluate(cdp, `(() => {
        const menu = document.querySelector('button[aria-controls="primary-navigation"]');
        return { expanded: menu.getAttribute('aria-expanded'), focusReturned: document.activeElement === menu };
      })()`);
      if (closed.expanded !== "false" || !closed.focusReturned) {
        throw new Error(`Escape 메뉴 닫기 실패 (${width}px): ${JSON.stringify(closed)}`);
      }
      menuInteraction = { opened, closed };
    }

    let railInteraction = null;
    if (width === 390) {
      railInteraction = await evaluate(cdp, `(() => {
        const rails = [...document.querySelectorAll('[data-mobile-rail]')];
        return rails.map((rail) => ({
          name: rail.getAttribute('data-mobile-rail'),
          clientWidth: rail.clientWidth,
          scrollWidth: rail.scrollWidth,
          scrollSnapType: getComputedStyle(rail).scrollSnapType,
        }));
      })()`);
      if (
        railInteraction.length !== 2 ||
        railInteraction.some((rail) => rail.scrollWidth <= rail.clientWidth || rail.scrollSnapType === "none")
      ) {
        throw new Error(`모바일 수평 레일 구성이 유효하지 않습니다: ${JSON.stringify(railInteraction)}`);
      }
      await evaluate(cdp, `[...document.querySelectorAll('[data-mobile-rail]')].forEach((rail) => { rail.scrollLeft = 180; })`);
      await delay(160);
      const movedRails = await evaluate(
        cdp,
        `[...document.querySelectorAll('[data-mobile-rail]')].map((rail) => Math.round(rail.scrollLeft))`,
      );
      if (movedRails.some((scrollLeft) => scrollLeft <= 0)) {
        throw new Error(`모바일 수평 레일 스크롤 실패: ${JSON.stringify(movedRails)}`);
      }
      railInteraction = railInteraction.map((rail, index) => ({ ...rail, movedTo: movedRails[index] }));
    }

    const revealCount = await evaluate(cdp, `document.querySelectorAll('[data-reveal]').length`);
    for (let index = 0; index < revealCount; index += 1) {
      await evaluate(cdp, `document.querySelectorAll('[data-reveal]')[${index}].scrollIntoView({ block: 'center' })`);
      await delay(90);
    }
    const unrevealed = await evaluate(
      cdp,
      `[...document.querySelectorAll('[data-reveal]')].filter((node) => node.getAttribute('data-revealed') !== 'true').length`,
    );
    if (unrevealed !== 0) throw new Error(`스크롤 진입 모션 완료 실패 (${width}px): ${unrevealed}개`);
    await evaluate(cdp, `scrollTo(0, 0)`);
    await delay(120);

    const screenshot = await cdp.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false,
    });
    const screenshotPath = resolve(outputDir, `home-${width}.png`);
    await writeFile(screenshotPath, Buffer.from(screenshot.data, "base64"));
    const sectionScreenshots = [];
    if (width === 390) {
      for (const sectionId of ["capabilities", "equipment", "contact"]) {
        await evaluate(cdp, `document.querySelector('#${sectionId}').scrollIntoView({ block: 'start' })`);
        await delay(120);
        const sectionCapture = await cdp.send("Page.captureScreenshot", {
          format: "png",
          fromSurface: true,
          captureBeyondViewport: false,
        });
        const sectionPath = resolve(outputDir, `home-390-${sectionId}.png`);
        await writeFile(sectionPath, Buffer.from(sectionCapture.data, "base64"));
        sectionScreenshots.push({ sectionId, screenshotPath: sectionPath });
      }
    }
    results.push({
      width,
      height,
      layout,
      menuInteraction,
      railInteraction,
      revealed: revealCount,
      screenshotPath,
      sectionScreenshots,
    });
  }

  const profileResults = [];
  for (const width of [390, 1440]) {
    const height = width === 390 ? 844 : 900;
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width === 390,
      screenWidth: width,
      screenHeight: height,
    });
    await navigate(cdp, `${origin}company-profile/`);
    await delay(500);
    const layout = await evaluate(cdp, `(() => ({
      h1Count: document.querySelectorAll('h1').length,
      innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
      brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).length,
    }))()`);
    if (layout.horizontalOverflow || layout.h1Count !== 1 || layout.brokenImages !== 0) {
      throw new Error(`회사 소개서 페이지 검증 실패 (${width}px): ${JSON.stringify(layout)}`);
    }
    const screenshot = await cdp.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false,
    });
    const screenshotPath = resolve(outputDir, `company-profile-${width}.png`);
    await writeFile(screenshotPath, Buffer.from(screenshot.data, "base64"));
    profileResults.push({ width, height, layout, screenshotPath });
  }

  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
    screenWidth: 390,
    screenHeight: 844,
  });
  await navigate(cdp, origin);
  await delay(250);
  const reducedMotion = await evaluate(cdp, `(() => {
    const page = document.querySelector('#precision-home');
    const hero = document.querySelector('[data-reveal]');
    return {
      mediaMatches: matchMedia('(prefers-reduced-motion: reduce)').matches,
      motionReady: page.hasAttribute('data-motion-ready'),
      opacity: getComputedStyle(hero).opacity,
      transform: getComputedStyle(hero).transform,
    };
  })()`);
  if (!reducedMotion.mediaMatches || reducedMotion.motionReady || reducedMotion.opacity !== "1" || reducedMotion.transform !== "none") {
    throw new Error(`감소된 모션 검증 실패: ${JSON.stringify(reducedMotion)}`);
  }

  process.stdout.write(
    `${JSON.stringify({ browser, origin, reducedMotion, viewports: results, profileViewports: profileResults }, null, 2)}\n`,
  );
  await cdp.send("Browser.close").catch(() => undefined);
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
    if (browserProcess && browserProcess.exitCode === null) {
      const closed = new Promise((resolveProcess) => browserProcess.once("close", resolveProcess));
      browserProcess.kill();
      await Promise.race([closed, delay(3_000)]);
    }
    await removeBrowserProfile(profileDir);
  }
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

function launchBrowser(executable, userDataDir) {
  const child = spawn(
    executable,
    [
      "--headless=new",
      "--disable-gpu",
      "--disable-extensions",
      "--no-default-browser-check",
      "--no-first-run",
      "--remote-debugging-port=0",
      `--user-data-dir=${userDataDir}`,
      "about:blank",
    ],
    { stdio: ["ignore", "pipe", "pipe"], windowsHide: true },
  );
  child.stdout.on("data", () => undefined);
  child.stderr.on("data", () => undefined);
  return child;
}

async function readDebugPort(userDataDir) {
  const portFile = resolve(userDataDir, "DevToolsActivePort");
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const [port] = (await readFile(portFile, "utf8")).split(/\r?\n/);
      if (port) return Number(port);
    } catch {
      // Chrome writes the port file after startup.
    }
    await delay(100);
  }
  throw new Error("브라우저 DevTools 포트를 확인하지 못했습니다.");
}

async function navigate(cdp, url) {
  const loaded = cdp.waitFor("Page.loadEventFired");
  await cdp.send("Page.navigate", { url });
  await loaded;
  await evaluate(cdp, `document.fonts.ready.then(() => true)`, true);
}

async function evaluate(cdp, expression, awaitPromise = false) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
}

async function removeBrowserProfile(directory) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await rm(directory, { recursive: true, force: true });
      return;
    } catch (error) {
      if (error?.code !== "EBUSY" || attempt === 4) throw error;
      await delay(250 * (attempt + 1));
    }
  }
}

class CdpSession {
  static async connect(url) {
    const socket = new WebSocket(url);
    await new Promise((resolveOpen, rejectOpen) => {
      socket.addEventListener("open", resolveOpen, { once: true });
      socket.addEventListener("error", rejectOpen, { once: true });
    });
    return new CdpSession(socket);
  }

  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    socket.addEventListener("message", (event) => this.receive(JSON.parse(event.data)));
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolveSend, rejectSend) => {
      this.pending.set(id, { resolve: resolveSend, reject: rejectSend });
    });
  }

  waitFor(method) {
    return new Promise((resolveEvent, rejectEvent) => {
      const timer = setTimeout(() => rejectEvent(new Error(`${method} 이벤트 시간 초과`)), 15_000);
      const listeners = this.listeners.get(method) ?? [];
      listeners.push((params) => {
        clearTimeout(timer);
        resolveEvent(params);
      });
      this.listeners.set(method, listeners);
    });
  }

  receive(message) {
    if (message.id) {
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
      return;
    }

    const listeners = this.listeners.get(message.method);
    const listener = listeners?.shift();
    if (listener) listener(message.params);
  }
}

await main();
