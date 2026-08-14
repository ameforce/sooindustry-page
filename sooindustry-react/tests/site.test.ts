import assert from "node:assert/strict";
import test from "node:test";
import { getPublicSiteUrl } from "../src/lib/site.ts";

test("public site URL is the canonical HTTPS production origin", () => {
  assert.equal(getPublicSiteUrl().origin, "https://sooindustrykorea.com");
});
