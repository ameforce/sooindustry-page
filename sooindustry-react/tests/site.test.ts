import assert from "node:assert/strict";
import test from "node:test";
import { getPublicSiteUrl } from "../src/lib/site.ts";

test("public site URL fails closed when missing or insecure", () => {
  const previous = process.env.NEXT_PUBLIC_SITE_URL;

  delete process.env.NEXT_PUBLIC_SITE_URL;
  assert.equal(getPublicSiteUrl(), null);

  process.env.NEXT_PUBLIC_SITE_URL = "http://example.com";
  assert.equal(getPublicSiteUrl(), null);

  if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = previous;
});
test("public site URL accepts an HTTPS origin", () => {
  const previous = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";

  assert.equal(getPublicSiteUrl()?.origin, "https://example.com");

  if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = previous;
});
