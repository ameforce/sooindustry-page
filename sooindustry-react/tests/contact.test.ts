import assert from "node:assert/strict";
import test from "node:test";
import {
  InquiryPreviewError,
  MAX_MESSAGE_LENGTH,
  previewInquiry,
  validateContact,
  type ContactValues,
} from "../src/lib/contact.ts";

const validValues: ContactValues = {
  name: "홍길동",
  company: "수인산업",
  email: "contact@example.com",
  topic: "vacuum",
  message: "진공열처리로 제작 범위를 문의합니다.",
  privacyAccepted: true,
};

test("valid contact values produce no validation errors", () => {
  assert.deepEqual(validateContact(validValues), {});
});

test("required fields and email format are validated", () => {
  const errors = validateContact({
    ...validValues,
    name: " ",
    email: "invalid",
    topic: "",
    message: "",
    privacyAccepted: false,
  });

  assert.equal(errors.name, "이름을 입력해 주세요.");
  assert.equal(errors.email, "올바른 이메일 형식으로 입력해 주세요.");
  assert.equal(errors.topic, "문의 분야를 선택해 주세요.");
  assert.equal(errors.message, "문의 내용을 입력해 주세요.");
  assert.ok(errors.privacyAccepted);
});

test("message length is bounded", () => {
  const errors = validateContact({ ...validValues, message: "가".repeat(MAX_MESSAGE_LENGTH + 1) });
  assert.ok(errors.message?.includes(MAX_MESSAGE_LENGTH.toLocaleString("ko-KR")));
});

test("preview validates without claiming delivery", async () => {
  const result = await previewInquiry(validValues, { isOnline: true, delayMs: 0 });
  assert.deepEqual(result, { delivered: false, mode: "preview" });
});

test("preview exposes a retryable offline error", async () => {
  await assert.rejects(
    previewInquiry(validValues, { isOnline: false, delayMs: 0 }),
    InquiryPreviewError,
  );
});
