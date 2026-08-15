import Link from "next/link";

export default function NotFound() {
  return (
    <section
      style={{
        display: "grid",
        minHeight: "70vh",
        placeContent: "center",
        padding: "calc(var(--header-height) + 80px) 24px 96px",
        textAlign: "center",
      }}
    >
      <p style={{ color: "var(--color-red-500)", fontWeight: 700 }}>404</p>
      <h1 style={{ margin: "8px 0 16px", fontSize: "clamp(2rem, 6vw, 4rem)" }}>페이지를 찾을 수 없습니다.</h1>
      <p style={{ margin: "0 0 28px", color: "var(--color-text-secondary)" }}>
        주소를 다시 확인하거나 홈페이지로 이동해 주세요.
      </p>
      <Link
        href="/"
        style={{
          justifySelf: "center",
          padding: "14px 22px",
          background: "var(--color-red-500)",
          color: "var(--color-white)",
          fontWeight: 700,
        }}
      >
        홈페이지로 이동
      </Link>
    </section>
  );
}
