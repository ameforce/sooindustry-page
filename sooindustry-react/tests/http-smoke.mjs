import assert from "node:assert/strict";
import { createPagesPreview } from "./static-server.mjs";

let server;
let origin = process.env.SMOKE_ORIGIN;

if (!origin) {
  server = createPagesPreview();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  origin = `http://127.0.0.1:${address.port}`;
}

try {
  const home = await fetch(origin, { redirect: "manual" });
  assert.equal(home.status, 200);
  assert.equal(home.headers.get("x-frame-options"), "DENY");
  assert.equal(home.headers.get("x-content-type-options"), "nosniff");
  assert.equal(home.headers.get("x-powered-by"), null);
  assert.match(home.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);
  assert.match(home.headers.get("strict-transport-security") ?? "", /max-age=31536000/);
  const homeBody = await home.text();
  assert.match(homeBody, /https:\/\/sooindustrykorea\.com\//);
  assert.match(homeBody, /rel="icon"[^>]+href="\/img\/sooin-logo\.gif"/);
  assert.doesNotMatch(homeBody, /href="\/favicon\.ico/);

  const brandIcon = await fetch(new URL("/img/sooin-logo.gif", origin));
  assert.equal(brandIcon.status, 200);
  assert.match(brandIcon.headers.get("content-type") ?? "", /image\/gif/);

  for (const [path, expectedLocation] of [
    ["/home", "/"],
    ["/about-us", "/#company"],
    ["/products", "/#capabilities"],
    ["/customer-support", "/#contact"],
  ]) {
    const response = await fetch(new URL(path, origin), { redirect: "manual" });
    assert.equal(response.status, 308, `${path} should redirect`);
    const location = new URL(response.headers.get("location"), origin);
    assert.equal(location.pathname + location.hash, expectedLocation);
  }

  const pdf = await fetch(new URL("/sooin.pdf", origin));
  assert.equal(pdf.status, 200);
  assert.match(pdf.headers.get("content-type") ?? "", /application\/pdf/);

  const robots = await fetch(new URL("/robots.txt", origin));
  assert.equal(robots.status, 200);
  const robotsBody = await robots.text();
  assert.match(robotsBody, /Allow: \//);
  assert.match(robotsBody, /Sitemap: https:\/\/sooindustrykorea\.com\/sitemap\.xml/);

  const sitemap = await fetch(new URL("/sitemap.xml", origin));
  assert.equal(sitemap.status, 200);
  assert.match(await sitemap.text(), /https:\/\/sooindustrykorea\.com\//);

  const missing = await fetch(new URL("/does-not-exist", origin));
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /페이지를 찾을 수 없습니다/);

  process.stdout.write(
    JSON.stringify({
      home: 200,
      canonical: "https://sooindustrykorea.com/",
      redirects: 4,
      pdf: 200,
      favicon: 200,
      robots: 200,
      sitemap: 200,
      notFound: 404,
      securityHeaders: 5,
    }),
  );
} finally {
  if (server) await new Promise((resolve) => server.close(resolve));
}
