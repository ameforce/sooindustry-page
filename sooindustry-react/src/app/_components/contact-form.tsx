"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  MAX_MESSAGE_LENGTH,
  previewInquiry,
  validateContact,
  type ContactErrors,
  type ContactValues,
} from "@/lib/contact";
import styles from "./contact-form.module.scss";

const initialValues: ContactValues = {
  name: "",
  company: "",
  email: "",
  topic: "",
  message: "",
  privacyAccepted: false,
};

type FormState = "idle" | "submitting" | "previewed" | "error";

export function ContactForm() {
  const [values, setValues] = useState<ContactValues>(initialValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [state, setState] = useState<FormState>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const remaining = useMemo(
    () => MAX_MESSAGE_LENGTH - values.message.length,
    [values.message.length],
  );

  const setField = <K extends keyof ContactValues>(field: K, value: ContactValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (state !== "idle") {
      setState("idle");
      setStatusMessage("");
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateContact(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setState("error");
      setStatusMessage("입력 내용을 확인해 주세요.");
      return;
    }

    setState("submitting");
    setStatusMessage("문의 내용을 확인하고 있습니다.");
    try {
      await previewInquiry(values, { isOnline: navigator.onLine });
      setState("previewed");
      setStatusMessage(
        "입력 검증이 완료되었습니다. 현재는 전송 준비 단계이므로 내용이 저장되거나 발송되지 않았습니다.",
      );
    } catch (error) {
      setState("error");
      setStatusMessage(
        error instanceof Error ? error.message : "확인 중 문제가 발생했습니다. 다시 시도해 주세요.",
      );
    }
  };

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.statusBadge}>전송 연동 전 · 입력 프리뷰</div>
      <div className={styles.fieldGrid}>
        <Field label="이름" id="contact-name" error={errors.name} required>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(event) => setField("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
        </Field>
        <Field label="회사명" id="contact-company" hint="선택 입력">
          <input
            id="contact-company"
            name="company"
            autoComplete="organization"
            value={values.company}
            onChange={(event) => setField("company", event.target.value)}
          />
        </Field>
      </div>
      <div className={styles.fieldGrid}>
        <Field label="이메일" id="contact-email" error={errors.email} required>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            onChange={(event) => setField("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
        </Field>
        <Field label="문의 분야" id="contact-topic" error={errors.topic} required>
          <select
            id="contact-topic"
            name="topic"
            value={values.topic}
            onChange={(event) => setField("topic", event.target.value)}
            aria-invalid={Boolean(errors.topic)}
            aria-describedby={errors.topic ? "contact-topic-error" : undefined}
          >
            <option value="">선택해 주세요</option>
            <option value="vacuum">진공열처리로</option>
            <option value="nitriding">가스연질화로</option>
            <option value="electric">전기로 및 대차로</option>
            <option value="carburizing">침탄열처리로</option>
            <option value="other">기타 설비</option>
          </select>
        </Field>
      </div>
      <Field label="문의 내용" id="contact-message" error={errors.message} required>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          maxLength={MAX_MESSAGE_LENGTH}
          value={values.message}
          onChange={(event) => setField("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error contact-message-count" : "contact-message-count"}
        />
        <span id="contact-message-count" className={styles.counter}>
          {remaining.toLocaleString("ko-KR")}자 남음
        </span>
      </Field>
      <div className={styles.consentWrap}>
        <label className={styles.consent} htmlFor="contact-privacy">
          <input
            id="contact-privacy"
            name="privacyAccepted"
            type="checkbox"
            checked={values.privacyAccepted}
            onChange={(event) => setField("privacyAccepted", event.target.checked)}
            aria-invalid={Boolean(errors.privacyAccepted)}
            aria-describedby={errors.privacyAccepted ? "contact-privacy-error" : undefined}
          />
          <span>입력한 내용이 전송 연동 전 프리뷰에만 사용됨을 확인했습니다.</span>
        </label>
        {errors.privacyAccepted ? (
          <span id="contact-privacy-error" className={styles.error}>
            {errors.privacyAccepted}
          </span>
        ) : null}
      </div>
      <div className={styles.actions}>
        <button className={styles.submit} type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? "확인 중…" : state === "error" ? "다시 확인하기" : "문의 내용 확인"}
        </button>
        {state === "previewed" ? (
          <button
            className={styles.reset}
            type="button"
            onClick={() => {
              setValues(initialValues);
              setErrors({});
              setState("idle");
              setStatusMessage("");
            }}
          >
            새 문의 작성
          </button>
        ) : null}
      </div>
      <p
        className={state === "error" ? styles.errorStatus : styles.status}
        role={state === "error" ? "alert" : "status"}
        aria-live="polite"
      >
        {statusMessage}
      </p>
    </form>
  );
}
function Field({
  children,
  error,
  hint,
  id,
  label,
  required = false,
}: Readonly<{
  children: React.ReactNode;
  error?: string;
  hint?: string;
  id: string;
  label: string;
  required?: boolean;
}>) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
        {hint ? <small>{hint}</small> : null}
      </label>
      {children}
      {error ? (
        <span id={`${id}-error`} className={styles.error}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
