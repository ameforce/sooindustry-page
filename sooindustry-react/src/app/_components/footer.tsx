import Image from "next/image";
import Link from "next/link";
import { companyContact } from "@/data/companyContact";
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
        <div className={styles.businessDetails} aria-label="수인산업 사업자 정보">
          <span>대표자 {companyContact.representative}</span>
          <span>사업자등록번호 {companyContact.businessRegistrationNumber}</span>
          <span>전화 {companyContact.phoneDisplay}</span>
          <span>FAX {companyContact.faxDisplay}</span>
        </div>
        <p className={styles.copyright}>
          Copyright © {new Date().getFullYear()} SOOIN INDUSTRY. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
