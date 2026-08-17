import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { companyContact } from "../src/data/companyContact.ts";
import { equipmentGallery } from "../src/data/precisionProof.ts";
import { getPublicSiteUrl } from "../src/lib/site.ts";
import { getSiteStructuredData } from "../src/lib/structuredData.ts";

test("public site URL is the canonical HTTPS production origin", () => {
  assert.equal(getPublicSiteUrl().origin, "https://sooindustrykorea.com");
});

test("company contact data uses the verified registration, representative, phone, fax, address, and map places", () => {
  assert.equal(companyContact.businessRegistrationNumber, "439-40-00067");
  assert.equal(companyContact.representative, "김웅기");
  assert.equal(companyContact.phoneDisplay, "032-517-2473");
  assert.equal(companyContact.phoneHref, "tel:+82325172473");
  assert.equal(companyContact.faxDisplay, "032-567-2473");
  assert.equal(companyContact.addressLine1, "인천광역시 서구 마중로 142");
  assert.equal(companyContact.addressLine2, "나동 5호 (오류동)");

  assert.equal(
    companyContact.naverMapHref,
    "https://map.naver.com/p/entry/place/37323307?placePath=%2Fhome",
  );
  assert.equal(companyContact.kakaoMapHref, "https://place.map.kakao.com/1523327998");
});

test("structured data identifies the website and the Incheon business with verified contact data", () => {
  const structuredData = getSiteStructuredData();
  const [website, organization] = structuredData["@graph"];

  assert.equal(website["@type"], "WebSite");
  assert.equal(website.name, "수인산업");
  assert.equal(website.url, "https://sooindustrykorea.com/");
  assert.equal(website.publisher["@id"], "https://sooindustrykorea.com/#organization");

  assert.deepEqual(organization["@type"], ["Organization", "LocalBusiness"]);
  assert.equal(organization.name, "수인산업");
  assert.equal(organization.telephone, "+82325172473");
  assert.equal(organization.address.addressRegion, "인천광역시");
  assert.equal(organization.address.addressLocality, "서구");
  assert.equal(organization.address.streetAddress, "마중로 142, 나동 5호 (오류동)");
  assert.deepEqual(organization.hasMap, [companyContact.naverMapHref, companyContact.kakaoMapHref]);
});

test("equipment gallery includes the curated source images without duplicate paths", () => {
  const images = equipmentGallery.map((item) => item.image);

  assert.equal(new Set(images).size, images.length);
  assert.deepEqual(images.slice(0, 3), [
    "/img/equipment/vacuum-line-pair.jpg",
    "/img/equipment/vacuum-system-rear.jpg",
    "/img/equipment/vacuum-chamber-interior.jpg",
  ]);
});

test("repository policy requires a real-phone HTTPS preview for mobile acceptance", async () => {
  const instructions = await readFile(resolve(import.meta.dirname, "../../AGENTS.md"), "utf8");

  assert.match(instructions, /real phone/);
  assert.match(instructions, /Cloudflare Quick Tunnel/);
  assert.match(instructions, /QR code/);
  assert.match(instructions, /not sufficient for mobile acceptance/);
});
