import assert from "node:assert/strict";
import test from "node:test";
import { companyContact } from "../src/data/companyContact.ts";
import { getPublicSiteUrl } from "../src/lib/site.ts";

test("public site URL is the canonical HTTPS production origin", () => {
  assert.equal(getPublicSiteUrl().origin, "https://sooindustrykorea.com");
});

test("company contact links use the verified phone and address search", () => {
  assert.equal(companyContact.phoneDisplay, "032-517-2473");
  assert.equal(companyContact.phoneHref, "tel:+82325172473");
  assert.equal(companyContact.addressLine1, "인천광역시 서구 마중로 142");
  assert.equal(companyContact.addressLine2, "나동 5호 (오류동)");

  const naverMap = new URL(companyContact.naverMapHref);
  const kakaoMap = new URL(companyContact.kakaoMapHref);
  assert.equal(naverMap.hostname, "map.naver.com");
  assert.equal(kakaoMap.hostname, "map.kakao.com");
  assert.match(decodeURIComponent(companyContact.naverMapHref), /수인산업.*마중로 142.*나동 5호/);
  assert.match(decodeURIComponent(companyContact.kakaoMapHref), /수인산업.*마중로 142.*나동 5호/);
});
