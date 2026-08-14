import assert from "node:assert/strict";
import test from "node:test";
import { companyContact } from "../src/data/companyContact.ts";
import { getPublicSiteUrl } from "../src/lib/site.ts";

test("public site URL is the canonical HTTPS production origin", () => {
  assert.equal(getPublicSiteUrl().origin, "https://sooindustrykorea.com");
});

test("company contact links use the verified phone, address, and map places", () => {
  assert.equal(companyContact.phoneDisplay, "032-517-2473");
  assert.equal(companyContact.phoneHref, "tel:+82325172473");
  assert.equal(companyContact.addressLine1, "인천광역시 서구 마중로 142");
  assert.equal(companyContact.addressLine2, "나동 5호 (오류동)");

  assert.equal(
    companyContact.naverMapHref,
    "https://map.naver.com/p/entry/place/37323307?placePath=%2Fhome",
  );
  assert.equal(companyContact.kakaoMapHref, "https://place.map.kakao.com/1523327998");
});
