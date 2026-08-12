import Image from "next/image";
import Link from "next/link";
import styles from "./footer.module.scss";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <Link className={styles.brand} href="/">
          <Image src="/img/sooin-logo.gif" alt="" width={52} height={34} unoptimized />
          <span>SOOIN INDUSTRY</span>
        </Link>
        <nav aria-label="하단 메뉴">
          <Link href="/#company">회사 소개</Link>
          <Link href="/#capabilities">주요 사업</Link>
          <Link href="/#equipment">실제 설비</Link>
          <Link href="/#contact">문의</Link>
        </nav>
      </div>
      <div className={styles.bottom}>
        <p>열처리 산업로의 합리화와 효율화</p>
        <p>© {new Date().getFullYear()} SOOIN INDUSTRY</p>
      </div>
    </footer>
  );
}
