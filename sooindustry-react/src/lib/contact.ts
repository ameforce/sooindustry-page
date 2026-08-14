export const MAX_MESSAGE_LENGTH = 2000;

export type ContactValues = Readonly<{
  name: string;
  company: string;
  email: string;
  topic: string;
  message: string;
  privacyAccepted: boolean;
}>;

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};

  if (!values.name.trim()) errors.name = "이름을 입력해 주세요.";
  if (!values.email.trim()) {
    errors.email = "이메일을 입력해 주세요.";
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = "올바른 이메일 형식으로 입력해 주세요.";
  }
  if (!values.topic) errors.topic = "문의 분야를 선택해 주세요.";
  if (!values.message.trim()) {
    errors.message = "문의 내용을 입력해 주세요.";
  } else if (values.message.trim().length > MAX_MESSAGE_LENGTH) {
    errors.message = `문의 내용은 ${MAX_MESSAGE_LENGTH.toLocaleString("ko-KR")}자 이하로 입력해 주세요.`;
  }
  if (!values.privacyAccepted) {
    errors.privacyAccepted = "문의 확인을 위해 개인정보 처리 안내에 동의해 주세요.";
  }

  return errors;
}

export class InquiryPreviewError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InquiryPreviewError";
  }
}

export async function previewInquiry(
  values: ContactValues,
  options: Readonly<{ isOnline: boolean; delayMs?: number }>,
): Promise<Readonly<{ delivered: false; mode: "preview" }>> {
  const errors = validateContact(values);
  if (Object.keys(errors).length > 0) {
    throw new InquiryPreviewError("입력 내용을 다시 확인해 주세요.");
  }
  if (!options.isOnline) {
    throw new InquiryPreviewError("네트워크 연결을 확인한 뒤 다시 시도해 주세요.");
  }

  await new Promise((resolve) => setTimeout(resolve, options.delayMs ?? 300));
  return { delivered: false, mode: "preview" };
}
