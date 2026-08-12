import assert from "node:assert/strict";

const origin = process.env.SMOKE_ORIGIN ?? "http://localhost:3000";

const home = await fetch(origin, { redirect: "manual" });
assert.equal(home.status, 200);
assert.equal(home.headers.get("x-frame-options"), "DENY");
assert.equal(home.headers.get("x-content-type-options"), "nosniff");
assert.equal(home.headers.get("x-powered-by"), null);
assert.match(home.headers.get("content-security-policy") ?? "", /frame-ancestors 'none'/);

for (const [path, expectedLocation] of [
  ["/home", "/"],
  ["/about-us", "/#company"],
  ["/products", "/#capabilities"],
  ["/customer-support", "/#contact"],
]) {
  const response = await fetch(new URL(path, origin), { redirect: "manual" });
  assert.ok([307, 308].includes(response.status), `${path} should redirect`);
  assert.equal(new URL(response.headers.get("location"), origin).pathname + new URL(response.headers.get("location"), origin).hash, expectedLocation);
}

const pdf = await fetch(new URL("/sooin.pdf", origin));
assert.equal(pdf.status, 200);
assert.match(pdf.headers.get("content-type") ?? "", /application\/pdf/);

const robots = await fetch(new URL("/robots.txt", origin));
assert.equal(robots.status, 200);
assert.match(await robots.text(), /Disallow: \//);

const sitemap = await fetch(new URL("/sitemap.xml", origin));
assert.equal(sitemap.status, 200);
assert.doesNotMatch(await sitemap.text(), /localhost/);

const missing = await fetch(new URL("/does-not-exist", origin));
assert.equal(missing.status, 404);

process.stdout.write(
  JSON.stringify({
    home: home.status,
    redirects: 4,
    pdf: pdf.status,
    robots: robots.status,
    sitemap: sitemap.status,
    notFound: missing.status,
    securityHeaders: 4,
  }),
);
