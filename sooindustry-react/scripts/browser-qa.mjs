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
  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });

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
    await cdp.send("Emulation.setTouchEmulationEnabled", {
      enabled: width <= 768,
      maxTouchPoints: width <= 768 ? 5 : 1,
    });
    await navigate(cdp, origin);
    await delay(1_200);

    const layout = await evaluate(cdp, `(() => {
      const visibleHiddenReveals = [...document.querySelectorAll('[data-reveal]')].filter((node) => {
        const rect = node.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < innerHeight * 0.9 && getComputedStyle(node).opacity === '0';
      }).length;
      const menu = document.querySelector('button[aria-controls="primary-navigation"]');
      const navigation = document.querySelector('#primary-navigation');
      const equipmentHero = document.querySelector('[data-equipment-hero]');
      const equipmentHeroRect = equipmentHero.getBoundingClientRect();
      const sampleInput = document.querySelector('#contact-name');
      const sampleSelect = document.querySelector('#contact-topic');
      const sampleTextarea = document.querySelector('#contact-message');
      const header = document.querySelector('header');
      const backToTop = document.querySelector('[data-back-to-top]');
      const iconHrefs = [...document.querySelectorAll('link[rel*="icon"]')].map((link) => link.href);
      const process = document.querySelector('#process');
      const processAtmosphere = process.querySelector('[class*="processAtmosphere"] span');
      const wrapChecks = [...document.querySelectorAll('[data-wrap-check]')];
      const splitTokens = [];
      for (const element of wrapChecks) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        let textNode = walker.nextNode();
        while (textNode) {
          for (const match of textNode.nodeValue.matchAll(/\S+/g)) {
            const range = document.createRange();
            range.setStart(textNode, match.index);
            range.setEnd(textNode, match.index + match[0].length);
            const lines = new Set([...range.getClientRects()].map((rect) => Math.round(rect.top)));
            if (lines.size > 1) splitTokens.push({ token: match[0], lines: [...lines] });
          }
          textNode = walker.nextNode();
        }
      }
      const phoneLink = document.querySelector('a[href="tel:+82325172473"]');
      const mapLinks = [...document.querySelectorAll('a[aria-label*="지도에서 수인산업 위치 보기"], a[aria-label*="카카오맵에서 수인산업 위치 보기"]')];
      const lineCount = (element) => {
        const semanticPhrases = [...element.children].filter((child) => child.tagName === 'SPAN');
        if (semanticPhrases.length > 0) {
          return new Set(semanticPhrases.map((child) => Math.round(child.getBoundingClientRect().top))).size;
        }
        const range = document.createRange();
        range.selectNodeContents(element);
        return new Set([...range.getClientRects()].filter((rect) => rect.width > 1).map((rect) => Math.round(rect.top))).size;
      };
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
        pageScrollbar: {
          rootWidth: getComputedStyle(document.documentElement).scrollbarWidth,
          webkitDisplay: getComputedStyle(document.documentElement, '::-webkit-scrollbar').display,
        },
        headerBackground: getComputedStyle(header).backgroundColor,
        typography: {
          bodyFamily: getComputedStyle(document.body).fontFamily,
          bodySynthesis: getComputedStyle(document.body).fontSynthesis,
          pretendardReady: document.fonts.check('600 16px "Pretendard Variable"'),
        },
        favicon: {
          hrefs: iconHrefs,
          hasBrandIcon: iconHrefs.some((href) => href.endsWith('/img/sooin-logo.gif')),
          hasLegacyGenericIcon: iconHrefs.some((href) => href.includes('/favicon.ico')),
        },
        backToTop: {
          hiddenAtTop: backToTop.getAttribute('aria-hidden'),
          tabIndexAtTop: backToTop.tabIndex,
        },
        processVisual: {
          stepCount: process.querySelectorAll('ol > li').length,
          descriptionCount: process.querySelectorAll('ol > li p').length,
          background: getComputedStyle(process).backgroundColor,
          atmosphereAnimation: getComputedStyle(processAtmosphere).animationName,
        },
        selectionPolicy: {
          body: getComputedStyle(document.body).userSelect,
          heading: getComputedStyle(document.querySelector('h1')).userSelect,
          input: getComputedStyle(sampleInput).userSelect,
          select: getComputedStyle(sampleSelect).userSelect,
          textarea: getComputedStyle(sampleTextarea).userSelect,
        },
        contactForm: {
          fontSizes: [...document.querySelectorAll('#contact input, #contact select, #contact textarea')].map((control) => ({
            id: control.id,
            fontSize: Number.parseFloat(getComputedStyle(control).fontSize),
          })),
          viewport: document.querySelector('meta[name="viewport"]')?.getAttribute('content') ?? '',
        },
        wrapping: {
          checked: wrapChecks.length,
          allKeepWords: wrapChecks.every((node) => getComputedStyle(node).wordBreak === 'keep-all'),
          splitTokens,
          heroTitleLines: lineCount(document.querySelector('#hero-title')),
          contactTitleLines: lineCount(document.querySelector('#contact-title')),
          engineeringScopeLines: lineCount(document.querySelector('[data-engineering-scope]')),
        },
        contactInfo: {
          phoneHref: phoneLink?.getAttribute('href') ?? null,
          phoneText: phoneLink?.textContent.replace(/\s+/g, ' ').trim() ?? null,
          phoneTapHeight: phoneLink ? Math.round(phoneLink.getBoundingClientRect().height) : 0,
          address: document.querySelector('address')?.textContent.replace(/\s+/g, ' ').trim() ?? null,
          maps: mapLinks.map((link) => ({
            href: link.getAttribute('href'),
            target: link.getAttribute('target'),
            rel: link.getAttribute('rel'),
            tapHeight: Math.round(link.getBoundingClientRect().height),
          })),
        },
      };
    })()`);

    layout.pageScroll = await evaluate(cdp, `(() => {
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      scrollTo(0, Math.min(240, root.scrollHeight - innerHeight));
      const movedTo = Math.round(scrollY);
      scrollTo(0, 0);
      root.style.scrollBehavior = previousScrollBehavior;
      return {
        scrollable: root.scrollHeight > root.clientHeight,
        movedTo,
        resetTo: Math.round(scrollY),
      };
    })()`);

    if (
      layout.horizontalOverflow ||
      layout.pageScrollbar.rootWidth !== "none" ||
      layout.pageScrollbar.webkitDisplay !== "none" ||
      !layout.pageScroll.scrollable ||
      layout.pageScroll.movedTo < 100 ||
      layout.pageScroll.resetTo !== 0 ||
      layout.h1Count !== 1 ||
      layout.primaryActionCount !== 1 ||
      layout.missingImageAlt !== 0 ||
      layout.brokenImages !== 0 ||
      layout.unlabelledFormControls !== 0 ||
      layout.visibleHiddenReveals !== 0 ||
      layout.selectionPolicy.body !== "none" ||
      layout.selectionPolicy.heading !== "none" ||
      layout.selectionPolicy.input !== "text" ||
      layout.selectionPolicy.select !== "text" ||
      layout.selectionPolicy.textarea !== "text" ||
      (width <= 768 && layout.contactForm.fontSizes.some((control) => control.fontSize < 16)) ||
      /(?:maximum-scale\s*=|user-scalable\s*=\s*no)/i.test(layout.contactForm.viewport) ||
      layout.wrapping.checked < 10 ||
      !layout.wrapping.allKeepWords ||
      layout.wrapping.splitTokens.length !== 0 ||
      layout.wrapping.heroTitleLines > 2 ||
      layout.wrapping.contactTitleLines > 2 ||
      layout.wrapping.engineeringScopeLines !== 1 ||
      !layout.typography.bodyFamily.includes("Pretendard Variable") ||
      layout.typography.bodySynthesis !== "none" ||
      !layout.typography.pretendardReady ||
      !layout.favicon.hasBrandIcon ||
      layout.favicon.hasLegacyGenericIcon ||
      layout.backToTop.hiddenAtTop !== "true" ||
      layout.backToTop.tabIndexAtTop !== -1 ||
      layout.processVisual.stepCount !== 4 ||
      layout.processVisual.descriptionCount !== 4 ||
      layout.processVisual.background !== "rgb(7, 20, 38)" ||
      layout.processVisual.atmosphereAnimation === "none" ||
      layout.contactInfo.phoneHref !== "tel:+82325172473" ||
      !layout.contactInfo.phoneText.includes("032-517-2473") ||
      layout.contactInfo.phoneTapHeight < 44 ||
      !layout.contactInfo.address.includes("인천광역시 서구 마중로 142 나동 5호 (오류동)") ||
      layout.contactInfo.maps.length !== 2 ||
      layout.contactInfo.maps.some(
        (link) =>
          link.target !== "_blank" ||
          link.rel !== "noopener noreferrer" ||
          link.tapHeight < 44 ||
          ![
            "https://map.naver.com/p/entry/place/37323307?placePath=%2Fhome",
            "https://place.map.kakao.com/1523327998",
          ].includes(link.href),
      )
    ) {
      throw new Error(`레이아웃 검증 실패 (${width}px): ${JSON.stringify(layout)}`);
    }

    await evaluate(cdp, `scrollTo(0, Math.min(900, document.documentElement.scrollHeight - innerHeight))`);
    await delay(220);
    const backToTopVisible = await evaluate(cdp, `(() => {
      const button = document.querySelector('[data-back-to-top]');
      return {
        visible: button.getAttribute('data-visible'),
        hidden: button.getAttribute('aria-hidden'),
        tabIndex: button.tabIndex,
        tapWidth: Math.round(button.getBoundingClientRect().width),
        tapHeight: Math.round(button.getBoundingClientRect().height),
      };
    })()`);
    await evaluate(cdp, `document.querySelector('[data-back-to-top]').click()`);
    await delay(1_000);
    const backToTopSettled = await evaluate(cdp, `Math.round(scrollY)`);
    if (
      backToTopVisible.visible !== "true" ||
      backToTopVisible.hidden !== "false" ||
      backToTopVisible.tabIndex !== 0 ||
      backToTopVisible.tapWidth < 44 ||
      backToTopVisible.tapHeight < 44 ||
      backToTopSettled !== 0
    ) {
      throw new Error(
        `맨 위로 이동 버튼 검증 실패 (${width}px): ${JSON.stringify({ backToTopVisible, backToTopSettled })}`,
      );
    }
    const backToTopInteraction = { visible: backToTopVisible, settledScrollY: backToTopSettled };
    const lightboxInteraction = await lightboxCanary(cdp, width, outputDir);
    if (width <= 768 && layout.menuHeight < 44) throw new Error(`모바일 메뉴 터치 영역이 44px 미만입니다: ${width}px`);
    if (width <= 768 && layout.headerBackground !== "rgb(255, 255, 255)") {
      throw new Error(`모바일 헤더가 불투명하지 않습니다 (${width}px): ${layout.headerBackground}`);
    }
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

      await evaluate(cdp, `document.querySelector('button[aria-controls="primary-navigation"]').click()`);
      await delay(220);
      await evaluate(cdp, `document.querySelector('#primary-navigation a[href="/#equipment"]').click()`);
      await delay(1_180);
      const navigation = await evaluate(cdp, `(() => {
        const menu = document.querySelector('button[aria-controls="primary-navigation"]');
        const target = document.querySelector('#equipment');
        return {
          expanded: menu.getAttribute('aria-expanded'),
          bodyLocked: document.body.hasAttribute('data-menu-open'),
          hash: location.hash,
          targetTop: Math.round(target.getBoundingClientRect().top),
          arriving: target.getAttribute('data-anchor-arriving'),
        };
      })()`);
      if (
        navigation.expanded !== "false" ||
        navigation.bodyLocked ||
        navigation.hash !== "#equipment" ||
        navigation.targetTop < 70 ||
        navigation.targetTop > 110 ||
        navigation.arriving !== "true"
      ) {
        throw new Error(`모바일 메뉴 앵커 이동 실패 (${width}px): ${JSON.stringify(navigation)}`);
      }
      menuInteraction = { opened, closed, navigation };
    }

    const logoInteraction = await evaluate(cdp, `(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      const contact = document.querySelector('#contact');
      contact.scrollIntoView({ block: 'start' });
      history.replaceState(null, '', '#contact');
      const before = Math.round(scrollY);
      document.documentElement.style.scrollBehavior = '';
      document.querySelector('[data-brand-link]').click();
      return { before, hashAfterClick: location.hash };
    })()`);
    await delay(120);
    logoInteraction.inFlight = await evaluate(cdp, `Math.round(scrollY)`);
    await delay(1_000);
    logoInteraction.settled = await evaluate(cdp, `(() => ({
      hash: location.hash,
      scrollY: Math.round(scrollY),
      anchorScrolling: document.querySelector('#precision-home').hasAttribute('data-anchor-scrolling'),
    }))()`);
    if (
      logoInteraction.before <= 0 ||
      logoInteraction.hashAfterClick !== '' ||
      logoInteraction.inFlight <= 0 ||
      logoInteraction.inFlight >= logoInteraction.before ||
      logoInteraction.settled.hash !== '' ||
      logoInteraction.settled.scrollY !== 0 ||
      logoInteraction.settled.anchorScrolling
    ) {
      throw new Error(`로고 상단 이동 검증 실패 (${width}px): ${JSON.stringify(logoInteraction)}`);
    }

    await evaluate(cdp, `(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      scrollTo(0, 0);
      history.replaceState(null, '', location.pathname);
      document.documentElement.style.scrollBehavior = '';
      document.querySelector('[data-primary-action]').click();
    })()`);
    await delay(120);
    const anchorInFlight = await evaluate(cdp, `(() => {
      const page = document.querySelector('#precision-home');
      const progress = document.querySelector('[class*="anchorProgress"]');
      return {
        scrolling: page.getAttribute('data-anchor-scrolling'),
        progress: Number(progress.style.getPropertyValue('--anchor-progress')),
        scrollY: Math.round(scrollY),
      };
    })()`);
    await delay(1_100);
    const anchorSettled = await evaluate(cdp, `(() => {
      const target = document.querySelector('#contact');
      return {
        hash: location.hash,
        targetTop: Math.round(target.getBoundingClientRect().top),
        arriving: target.getAttribute('data-anchor-arriving'),
        scrolling: document.querySelector('#precision-home').hasAttribute('data-anchor-scrolling'),
      };
    })()`);
    if (
      anchorInFlight.scrolling !== "true" ||
      anchorInFlight.progress <= 0 ||
      anchorInFlight.progress >= 1 ||
      anchorInFlight.scrollY <= 0 ||
      anchorSettled.hash !== "#contact" ||
      anchorSettled.targetTop < 70 ||
      anchorSettled.targetTop > 110 ||
      anchorSettled.arriving !== "true" ||
      anchorSettled.scrolling
    ) {
      throw new Error(
        `제작 상담 앵커 모션 실패 (${width}px): ${JSON.stringify({ anchorInFlight, anchorSettled })}`,
      );
    }
    const anchorInteraction = { inFlight: anchorInFlight, settled: anchorSettled };

    let railInteraction = null;
    if (width === 390) {
      railInteraction = await evaluate(cdp, `(() => {
        const rails = [...document.querySelectorAll('[data-mobile-rail]')];
        return rails.map((rail) => ({
          name: rail.getAttribute('data-mobile-rail'),
          clientWidth: rail.clientWidth,
          scrollWidth: rail.scrollWidth,
          scrollSnapType: getComputedStyle(rail).scrollSnapType,
          touchAction: getComputedStyle(rail).touchAction,
          nativeScrollbarHidden: getComputedStyle(rail, '::-webkit-scrollbar').display === 'none',
          rangeVisible: getComputedStyle(document.querySelector('[data-rail-range="' + rail.dataset.mobileRail + '"]')).display !== 'none',
        }));
      })()`);
      if (
        railInteraction.length !== 2 ||
        railInteraction.some(
          (rail) =>
            rail.scrollWidth <= rail.clientWidth ||
            rail.scrollSnapType === "none" ||
            !rail.touchAction.includes("pan-y") ||
            !rail.nativeScrollbarHidden ||
            !rail.rangeVisible,
        )
      ) {
        throw new Error(`모바일 수평 레일 구성이 유효하지 않습니다: ${JSON.stringify(railInteraction)}`);
      }
      const movedRails = [
        await dragRail(cdp, "capabilities", false),
        await dragRail(cdp, "equipment", false),
      ];
      const linkDrag = await dragRail(cdp, "capabilities", true);
      if (
        movedRails.some(
          (result) => result.scrollLeft <= 0 || result.whilePressed.scrollLeft <= 0 || result.dragging !== null,
        ) ||
        linkDrag.whilePressed.scrollLeft <= 0 ||
        linkDrag.hash !== ""
      ) {
        throw new Error(
          `모바일 수평 레일 포인터 드래그 실패: ${JSON.stringify({ movedRails, linkDrag })}`,
        );
      }
      railInteraction = railInteraction.map((rail, index) => ({ ...rail, ...movedRails[index] }));
      railInteraction[0].linkDragSuppressed = true;

      const touchedRails = [
        await touchDragRail(cdp, "capabilities"),
        await touchDragRail(cdp, "equipment"),
      ];
      if (
        touchedRails.some(
          (result) => result.scrollLeft <= 0 || Math.abs(result.pageScrollDelta) > 2 || result.dragging !== null || result.lightboxOpen,
        )
      ) {
        throw new Error(`모바일 수평 레일 터치 축 잠금 실패: ${JSON.stringify(touchedRails)}`);
      }
      railInteraction = railInteraction.map((rail, index) => ({ ...rail, touch: touchedRails[index] }));

      const verticalTouchRails = [
        await touchVerticalDragRail(cdp, "capabilities"),
        await touchVerticalDragRail(cdp, "equipment"),
      ];
      if (
        verticalTouchRails.some(
          (result) => result.pageScrollDelta < 40 || result.scrollLeft !== 0 || result.dragging !== null,
        )
      ) {
        throw new Error(`모바일 수직 레일 스크롤 보존 실패: ${JSON.stringify(verticalTouchRails)}`);
      }
      railInteraction = railInteraction.map((rail, index) => ({ ...rail, verticalTouch: verticalTouchRails[index] }));

      const rangeInteraction = await evaluate(cdp, `(() => {
        return [...document.querySelectorAll('[data-rail-range]')].map((range) => {
          const railName = range.getAttribute('data-rail-range');
          const rail = document.querySelector('[data-mobile-rail="' + railName + '"]');
          range.value = '100';
          range.dispatchEvent(new Event('input', { bubbles: true }));
          const result = {
            name: railName,
            value: Number(range.value),
            scrollLeft: Math.round(rail.scrollLeft),
            maxScroll: Math.round(rail.scrollWidth - rail.clientWidth),
            output: document.querySelector('[data-rail-count="' + railName + '"]').value,
          };
          rail.scrollLeft = 0;
          return result;
        });
      })()`);
      if (
        rangeInteraction.length !== 2 ||
        rangeInteraction.some(
          (result) =>
            result.value !== 100 ||
            Math.abs(result.maxScroll - result.scrollLeft) > 1 ||
            result.output.split(' / ')[0] !== result.output.split(' / ')[1],
        )
      ) {
        throw new Error(`모바일 레일 진행 바 조작 실패: ${JSON.stringify(rangeInteraction)}`);
      }
      railInteraction = railInteraction.map((rail, index) => ({ ...rail, range: rangeInteraction[index] }));

      await evaluate(cdp, `(() => {
        const input = document.querySelector('#contact-name');
        input.scrollIntoView({ block: 'center' });
        input.focus();
      })()`);
      await cdp.send("Input.insertText", { text: "선택 가능한 입력" });
      await delay(80);
      const inputValue = await evaluate(cdp, `document.querySelector('#contact-name').value`);
      if (inputValue !== "선택 가능한 입력") {
        throw new Error(`폼 입력 편집 실패: ${JSON.stringify(inputValue)}`);
      }
      railInteraction = railInteraction.map((rail) => ({ ...rail, formInputEditable: true }));
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
    const sectionIds = width === 390
      ? ["capabilities", "equipment", "process", "contact"]
      : width === 1440
        ? ["process", "contact"]
        : [];
    if (sectionIds.length > 0) {
      for (const sectionId of sectionIds) {
        await evaluate(cdp, `document.querySelector('#${sectionId}').scrollIntoView({ block: 'start' })`);
        await delay(120);
        const sectionCapture = await cdp.send("Page.captureScreenshot", {
          format: "png",
          fromSurface: true,
          captureBeyondViewport: false,
        });
        const sectionPath = resolve(outputDir, `home-${width}-${sectionId}.png`);
        await writeFile(sectionPath, Buffer.from(sectionCapture.data, "base64"));
        sectionScreenshots.push({ sectionId, screenshotPath: sectionPath });
      }
    }
    results.push({
      width,
      height,
      layout,
      backToTopInteraction,
      lightboxInteraction,
      anchorInteraction,
      menuInteraction,
      logoInteraction,
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
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
    screenWidth: 390,
    screenHeight: 844,
  });
  const hashNavigation = await hashNavigationCanary(cdp, origin);

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
  await evaluate(cdp, `document.querySelector('[data-primary-action]').click()`);
  await delay(80);
  const reducedMotion = await evaluate(cdp, `(() => {
    const page = document.querySelector('#precision-home');
    const hero = document.querySelector('[data-reveal]');
    const target = document.querySelector('#contact');
    return {
      mediaMatches: matchMedia('(prefers-reduced-motion: reduce)').matches,
      motionReady: page.hasAttribute('data-motion-ready'),
      anchorScrolling: page.hasAttribute('data-anchor-scrolling'),
      anchorArriving: target.hasAttribute('data-anchor-arriving'),
      anchorHash: location.hash,
      anchorTargetTop: Math.round(target.getBoundingClientRect().top),
      opacity: getComputedStyle(hero).opacity,
      transform: getComputedStyle(hero).transform,
      railSnapTypes: [...document.querySelectorAll('[data-mobile-rail]')].map(
        (rail) => getComputedStyle(rail).scrollSnapType,
      ),
    };
  })()`);
  if (
    !reducedMotion.mediaMatches ||
    reducedMotion.motionReady ||
    reducedMotion.anchorScrolling ||
    reducedMotion.anchorArriving ||
    reducedMotion.anchorHash !== "#contact" ||
    reducedMotion.anchorTargetTop < 70 ||
    reducedMotion.anchorTargetTop > 110 ||
    reducedMotion.opacity !== "1" ||
    reducedMotion.transform !== "none" ||
    reducedMotion.railSnapTypes.length !== 2 ||
    reducedMotion.railSnapTypes.some((snapType) => snapType !== "none")
  ) {
    throw new Error(`감소된 모션 검증 실패: ${JSON.stringify(reducedMotion)}`);
  }

  await evaluate(cdp, `(() => {
    const contact = document.querySelector('#contact');
    contact.scrollIntoView({ block: 'start' });
    history.replaceState(null, '', '#contact');
    document.querySelector('[data-brand-link]').click();
  })()`);
  await delay(40);
  const reducedMotionLogo = await evaluate(cdp, `(() => ({
    hash: location.hash,
    scrollY: Math.round(scrollY),
  }))()`);
  if (reducedMotionLogo.hash !== '' || reducedMotionLogo.scrollY !== 0) {
    throw new Error(`감소된 모션 로고 상단 이동 실패: ${JSON.stringify(reducedMotionLogo)}`);
  }

  process.stdout.write(
    `${JSON.stringify({ browser, origin, hashNavigation, reducedMotion, reducedMotionLogo, viewports: results, profileViewports: profileResults }, null, 2)}\n`,
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

async function lightboxCanary(cdp, width, outputDir) {
  await evaluate(cdp, `(() => {
    const trigger = document.querySelector('[data-equipment-lightbox-trigger]');
    trigger.scrollIntoView({ block: 'center', inline: 'nearest' });
    trigger.focus({ preventScroll: true });
    trigger.click();
  })()`);
  await delay(150);

  const opened = await evaluate(cdp, `(() => {
    const dialog = document.querySelector('[data-equipment-lightbox]');
    const close = document.querySelector('[data-lightbox-close]');
    const panel = dialog?.querySelector('[class*="lightboxPanel"]');
    const image = dialog?.querySelector('img');
    const panelRect = panel?.getBoundingClientRect();
    return {
      open: Boolean(dialog),
      role: dialog?.getAttribute('role') ?? null,
      modal: dialog?.getAttribute('aria-modal') ?? null,
      bodyLocked: document.body.classList.contains('scroll-lock'),
      bodyOverflow: getComputedStyle(document.body).overflow,
      closeFocused: document.activeElement === close,
      title: document.querySelector('#equipment-lightbox-title')?.textContent?.trim() ?? null,
      caption: document.querySelector('#equipment-lightbox-caption')?.textContent?.replace(/\s+/g, ' ').trim() ?? null,
      alt: image?.getAttribute('alt') ?? null,
      imageLoaded: image?.complete && image.naturalWidth > 0,
      panel: panelRect ? {
        top: Math.round(panelRect.top),
        right: Math.round(panelRect.right),
        bottom: Math.round(panelRect.bottom),
        left: Math.round(panelRect.left),
      } : null,
    };
  })()`);
  if (
    !opened.open ||
    opened.role !== 'dialog' ||
    opened.modal !== 'true' ||
    !opened.bodyLocked ||
    opened.bodyOverflow !== 'hidden' ||
    !opened.closeFocused ||
    !opened.title ||
    !opened.caption ||
    !opened.alt ||
    !opened.imageLoaded ||
    !opened.panel ||
    opened.panel.top < 0 ||
    opened.panel.left < 0 ||
    opened.panel.right > width ||
    opened.panel.bottom > (width <= 768 ? 844 : 900)
  ) {
    throw new Error(`설비 라이트박스 열기 검증 실패 (${width}px): ${JSON.stringify(opened)}`);
  }

  const screenshot = await cdp.send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
  });
  const screenshotPath = resolve(outputDir, `lightbox-${width}.png`);
  await writeFile(screenshotPath, Buffer.from(screenshot.data, "base64"));

  const closeAndRead = async (selector) => {
    await evaluate(cdp, `document.querySelector('${selector}').click()`);
    await delay(80);
    return evaluate(cdp, `(() => ({
      open: Boolean(document.querySelector('[data-equipment-lightbox]')),
      bodyLocked: document.body.classList.contains('scroll-lock'),
      focusRestored: document.activeElement === document.querySelector('[data-equipment-lightbox-trigger]'),
    }))()`);
  };

  const closedByButton = await closeAndRead('[data-lightbox-close]');
  if (closedByButton.open || closedByButton.bodyLocked || !closedByButton.focusRestored) {
    throw new Error(`라이트박스 닫기 버튼 검증 실패 (${width}px): ${JSON.stringify(closedByButton)}`);
  }

  await evaluate(cdp, `document.querySelector('[data-equipment-lightbox-trigger]').click()`);
  await delay(80);
  const closedByBackdrop = await closeAndRead('[data-lightbox-backdrop]');
  if (closedByBackdrop.open || closedByBackdrop.bodyLocked || !closedByBackdrop.focusRestored) {
    throw new Error(`라이트박스 배경 닫기 검증 실패 (${width}px): ${JSON.stringify(closedByBackdrop)}`);
  }

  await evaluate(cdp, `document.querySelector('[data-equipment-lightbox-trigger]').click()`);
  await delay(80);
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
  await delay(80);
  const closedByEscape = await evaluate(cdp, `(() => ({
    open: Boolean(document.querySelector('[data-equipment-lightbox]')),
    bodyLocked: document.body.classList.contains('scroll-lock'),
    focusRestored: document.activeElement === document.querySelector('[data-equipment-lightbox-trigger]'),
  }))()`);
  if (closedByEscape.open || closedByEscape.bodyLocked || !closedByEscape.focusRestored) {
    throw new Error(`라이트박스 Escape 검증 실패 (${width}px): ${JSON.stringify(closedByEscape)}`);
  }

  return { opened, closedByButton, closedByBackdrop, closedByEscape, screenshotPath };
}

async function hashNavigationCanary(cdp, origin) {
  await navigate(cdp, `${origin}#contact`);
  await delay(420);
  const direct = await evaluate(cdp, `(() => {
    const target = document.querySelector('#contact');
    const page = document.querySelector('#precision-home');
    return {
      navigationType: performance.getEntriesByType('navigation')[0]?.type ?? null,
      hash: location.hash,
      scrollY: Math.round(scrollY),
      targetTop: Math.round(target.getBoundingClientRect().top),
      anchorScrolling: page.hasAttribute('data-anchor-scrolling'),
      anchorArriving: target.hasAttribute('data-anchor-arriving'),
    };
  })()`);
  if (
    direct.navigationType !== 'navigate' ||
    direct.hash !== '#contact' ||
    direct.scrollY <= 0 ||
    direct.targetTop < 70 ||
    direct.targetTop > 110 ||
    direct.anchorScrolling ||
    direct.anchorArriving
  ) {
    throw new Error(`직접 해시 이동 검증 실패: ${JSON.stringify(direct)}`);
  }

  const reloaded = cdp.waitFor("Page.loadEventFired");
  await cdp.send("Page.reload", { ignoreCache: true });
  await reloaded;
  await evaluate(cdp, `document.fonts.ready.then(() => true)`, true);
  await delay(300);
  const reloadInFlight = await evaluate(cdp, `(() => {
    const target = document.querySelector('#contact');
    const page = document.querySelector('#precision-home');
    return {
      navigationType: performance.getEntriesByType('navigation')[0]?.type ?? null,
      hash: location.hash,
      scrollY: Math.round(scrollY),
      reloadingToTop: page.hasAttribute('data-reload-resetting'),
      anchorScrolling: page.hasAttribute('data-anchor-scrolling'),
      anchorArriving: target.hasAttribute('data-anchor-arriving'),
    };
  })()`);
  await delay(1_100);
  const reloadSettled = await evaluate(cdp, `(() => {
    const target = document.querySelector('#contact');
    const page = document.querySelector('#precision-home');
    return {
      navigationType: performance.getEntriesByType('navigation')[0]?.type ?? null,
      hash: location.hash,
      scrollY: Math.round(scrollY),
      reloadingToTop: page.hasAttribute('data-reload-resetting'),
      anchorScrolling: page.hasAttribute('data-anchor-scrolling'),
      anchorArriving: target.hasAttribute('data-anchor-arriving'),
    };
  })()`);
  if (
    reloadInFlight.navigationType !== 'reload' ||
    reloadInFlight.hash !== '' ||
    reloadInFlight.anchorScrolling ||
    reloadInFlight.anchorArriving ||
    reloadSettled.navigationType !== 'reload' ||
    reloadSettled.hash !== '' ||
    reloadSettled.scrollY !== 0 ||
    reloadSettled.reloadingToTop ||
    reloadSettled.anchorScrolling ||
    reloadSettled.anchorArriving
  ) {
    throw new Error(`재로드 해시 초기화 검증 실패: ${JSON.stringify({ direct, reloadInFlight, reloadSettled })}`);
  }

  const noHashBeforeReload = await evaluate(cdp, `(() => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    history.replaceState(null, '', location.pathname);
    scrollTo(0, Math.min(1_400, document.documentElement.scrollHeight - innerHeight));
    root.style.scrollBehavior = previousScrollBehavior;
    return { hash: location.hash, scrollY: Math.round(scrollY) };
  })()`);
  if (noHashBeforeReload.hash !== '' || noHashBeforeReload.scrollY <= 0) {
    throw new Error(`무해시 재로드 사전조건 실패: ${JSON.stringify(noHashBeforeReload)}`);
  }

  const noHashReloaded = cdp.waitFor("Page.loadEventFired");
  await cdp.send("Page.reload", { ignoreCache: true });
  await noHashReloaded;
  await evaluate(cdp, `document.fonts.ready.then(() => true)`, true);
  await delay(300);
  const noHashReloadInFlight = await evaluate(cdp, `(() => {
    const target = document.querySelector('#contact');
    const page = document.querySelector('#precision-home');
    return {
      navigationType: performance.getEntriesByType('navigation')[0]?.type ?? null,
      hash: location.hash,
      scrollY: Math.round(scrollY),
      reloadingToTop: page.hasAttribute('data-reload-resetting'),
      anchorScrolling: page.hasAttribute('data-anchor-scrolling'),
      anchorArriving: target.hasAttribute('data-anchor-arriving'),
    };
  })()`);
  await delay(1_100);
  const noHashReloadSettled = await evaluate(cdp, `(() => {
    const target = document.querySelector('#contact');
    const page = document.querySelector('#precision-home');
    return {
      navigationType: performance.getEntriesByType('navigation')[0]?.type ?? null,
      hash: location.hash,
      scrollY: Math.round(scrollY),
      reloadingToTop: page.hasAttribute('data-reload-resetting'),
      anchorScrolling: page.hasAttribute('data-anchor-scrolling'),
      anchorArriving: target.hasAttribute('data-anchor-arriving'),
    };
  })()`);
  if (
    noHashReloadInFlight.navigationType !== 'reload' ||
    noHashReloadInFlight.hash !== '' ||
    noHashReloadInFlight.scrollY <= 0 ||
    !noHashReloadInFlight.reloadingToTop ||
    noHashReloadInFlight.anchorScrolling ||
    noHashReloadInFlight.anchorArriving ||
    noHashReloadSettled.navigationType !== 'reload' ||
    noHashReloadSettled.hash !== '' ||
    noHashReloadSettled.scrollY !== 0 ||
    noHashReloadSettled.reloadingToTop ||
    noHashReloadSettled.anchorScrolling ||
    noHashReloadSettled.anchorArriving
  ) {
    throw new Error(
      `무해시 재로드 상단 복귀 검증 실패: ${JSON.stringify({ noHashBeforeReload, noHashReloadInFlight, noHashReloadSettled })}`,
    );
  }

  return { direct, reloadInFlight, reloadSettled, noHashBeforeReload, noHashReloadInFlight, noHashReloadSettled };
}

async function dragRail(cdp, railName, startOnLink) {
  const geometry = await evaluate(cdp, `(() => {
    const rail = document.querySelector('[data-mobile-rail="${railName}"]');
    rail.scrollLeft = 0;
    rail.scrollIntoView({ block: 'center' });
    history.replaceState(null, '', location.pathname);
    const target = ${startOnLink ? "rail.querySelector('a')" : "rail"};
    target.scrollIntoView({ block: 'center', inline: 'nearest' });
    const rect = target.getBoundingClientRect();
    const startX = Math.min(innerWidth - 28, Math.max(150, rect.left + rect.width * 0.72));
    const startY = Math.min(innerHeight - 28, Math.max(28, rect.top + rect.height * 0.5));
    return { startX, startY, endX: Math.max(28, startX - 240) };
  })()`);
  await delay(80);

  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: geometry.startX,
    y: geometry.startY,
    pointerType: "mouse",
  });
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: geometry.startX,
    y: geometry.startY,
    button: "left",
    buttons: 1,
    clickCount: 1,
    pointerType: "mouse",
  });
  const pressed = await evaluate(cdp, `(() => ({
    railDragging: document.querySelector('[data-mobile-rail="${railName}"]').getAttribute('data-dragging'),
    hitRail: document.elementFromPoint(${geometry.startX}, ${geometry.startY})?.closest('[data-mobile-rail]')?.getAttribute('data-mobile-rail') ?? null,
  }))()`);
  for (let step = 1; step <= 7; step += 1) {
    const x = geometry.startX + ((geometry.endX - geometry.startX) * step) / 7;
    await cdp.send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x,
      y: geometry.startY,
      button: "left",
      buttons: 1,
      pointerType: "mouse",
    });
  }
  const whilePressed = await evaluate(cdp, `(() => {
    const rail = document.querySelector('[data-mobile-rail="${railName}"]');
    return {
      scrollLeft: Math.round(rail.scrollLeft),
      dragging: rail.getAttribute('data-dragging'),
    };
  })()`);
  await cdp.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: geometry.endX,
    y: geometry.startY,
    button: "left",
    buttons: 0,
    clickCount: 1,
    pointerType: "mouse",
  });
  await delay(160);

  return evaluate(cdp, `(() => {
    const rail = document.querySelector('[data-mobile-rail="${railName}"]');
    return {
      scrollLeft: Math.round(rail.scrollLeft),
      dragging: rail.getAttribute('data-dragging'),
      hash: location.hash,
      pressed: ${JSON.stringify(pressed)},
      whilePressed: ${JSON.stringify(whilePressed)},
    };
  })()`);
}

async function touchDragRail(cdp, railName) {
  const geometry = await evaluate(cdp, `(() => {
    const rail = document.querySelector('[data-mobile-rail="${railName}"]');
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    rail.scrollLeft = 0;
    rail.scrollIntoView({ block: 'center' });
    root.style.scrollBehavior = previousScrollBehavior;
    const rect = rail.getBoundingClientRect();
    const startX = Math.min(innerWidth - 32, rect.right - 34);
    const startY = Math.min(innerHeight - 48, Math.max(48, rect.top + rect.height * 0.52));
    return {
      startX,
      startY,
      endX: Math.max(32, startX - 230),
      endY: startY + 14,
      pageScrollY: Math.round(scrollY),
    };
  })()`);
  await delay(80);

  const touchPoint = (x, y) => ({
    x,
    y,
    id: 1,
    radiusX: 5,
    radiusY: 5,
    rotationAngle: 0,
    force: 1,
  });

  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [touchPoint(geometry.startX, geometry.startY)],
  });
  for (let step = 1; step <= 8; step += 1) {
    const progress = step / 8;
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        touchPoint(
          geometry.startX + (geometry.endX - geometry.startX) * progress,
          geometry.startY + (geometry.endY - geometry.startY) * progress,
        ),
      ],
    });
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await delay(220);

  return evaluate(cdp, `(() => {
    const rail = document.querySelector('[data-mobile-rail="${railName}"]');
    return {
      axis: 'horizontal-diagonal',
      deltaX: ${Math.round(geometry.endX - geometry.startX)},
      deltaY: ${Math.round(geometry.endY - geometry.startY)},
      scrollLeft: Math.round(rail.scrollLeft),
      pageScrollDelta: Math.round(scrollY) - ${geometry.pageScrollY},
      dragging: rail.getAttribute('data-dragging'),
      lightboxOpen: Boolean(document.querySelector('[data-equipment-lightbox]')),
    };
  })()`);
}

async function touchVerticalDragRail(cdp, railName) {
  const geometry = await evaluate(cdp, `(() => {
    const rail = document.querySelector('[data-mobile-rail="${railName}"]');
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    rail.scrollLeft = 0;
    rail.scrollIntoView({ block: 'center' });
    root.style.scrollBehavior = previousScrollBehavior;
    const rect = rail.getBoundingClientRect();
    const startX = Math.min(innerWidth - 32, Math.max(32, rect.left + rect.width * 0.52));
    const startY = Math.min(innerHeight - 72, Math.max(120, rect.top + rect.height * 0.55));
    return {
      startX,
      startY,
      endX: startX + 12,
      endY: Math.max(28, startY - 190),
      pageScrollY: Math.round(scrollY),
    };
  })()`);
  await delay(80);

  const touchPoint = (x, y) => ({
    x,
    y,
    id: 2,
    radiusX: 5,
    radiusY: 5,
    rotationAngle: 0,
    force: 1,
  });

  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [touchPoint(geometry.startX, geometry.startY)],
  });
  for (let step = 1; step <= 8; step += 1) {
    const progress = step / 8;
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        touchPoint(
          geometry.startX + (geometry.endX - geometry.startX) * progress,
          geometry.startY + (geometry.endY - geometry.startY) * progress,
        ),
      ],
    });
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await delay(220);

  return evaluate(cdp, `(() => {
    const rail = document.querySelector('[data-mobile-rail="${railName}"]');
    return {
      axis: 'vertical',
      scrollLeft: Math.round(rail.scrollLeft),
      pageScrollDelta: Math.round(scrollY) - ${geometry.pageScrollY},
      dragging: rail.getAttribute('data-dragging'),
    };
  })()`);
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
