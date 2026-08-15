import type { Metadata } from "next";
import Image from "next/image";
import { companyOverview } from "@/data/home";
import { capabilities, equipmentGallery, processSteps } from "@/data/precisionProof";
import styles from "./profile.module.scss";

export const metadata: Metadata = {
  title: "회사 소개서 | 수인산업",
  description: "수인산업의 회사 개요, 열처리 산업로 제품군, 실제 제작 설비와 프로젝트 진행 범위를 확인하세요.",
  alternates: { canonical: "/company-profile/" },
};

export default function CompanyProfilePage() {
  return (
    <article className={`${styles.profile} company-profile-document`}>
      <section className={`${styles.sheet} ${styles.cover}`} aria-labelledby="profile-cover-title">
        <div className={styles.coverImage}>
          <Image
            src="/img/general/misc-3.webp"
            alt="수인산업 열처리 설비"
            fill
            priority
            sizes="210mm"
          />
        </div>
        <div className={styles.coverShade} />
        <header className={styles.coverHeader}>
          <Image src="/img/sooin-logo.gif" alt="" width={58} height={38} unoptimized />
          <span>SOOIN INDUSTRY</span>
        </header>
        <div className={styles.coverCopy}>
          <p>COMPANY PROFILE</p>
          <h1 id="profile-cover-title">
            공정에 맞춘
            <br />
            열처리 산업로
          </h1>
          <strong>상담 · 설계 · 제작 · 설치</strong>
        </div>
        <footer className={styles.coverFooter}>
          <span>열처리 산업로의 합리화와 효율화</span>
          <span>sooindustrykorea.com</span>
        </footer>
      </section>

      <section className={`${styles.sheet} ${styles.overview}`} aria-labelledby="profile-overview-title">
        <ProfileHeader number="01" label="COMPANY" />
        <div className={styles.titleBlock}>
          <p>ABOUT SOOIN INDUSTRY</p>
          <h2 id="profile-overview-title">설비와 현장으로 증명하는 열처리 산업로 파트너</h2>
        </div>
        <div className={styles.overviewGrid}>
          <div className={styles.overviewCopy}>
            <p>
              수인산업은 진공로, 침탄로, 분위기로, 전기로, 가스연질화로와 피트로 등 다양한 열처리 산업로를
              설계·제작합니다.
            </p>
            <p>
              고객 공정 조건을 바탕으로 필요한 설비 구성을 검토하고 제작부터 설치·시공·사후관리까지 프로젝트
              흐름을 함께합니다.
            </p>
          </div>
          <dl className={styles.factGrid}>
            {companyOverview.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className={styles.scopeBand}>
          <p>ENGINEERING SCOPE</p>
          <ul>
            <li>공정 조건 검토</li>
            <li>열처리 설비 설계</li>
            <li>주문형 제작</li>
            <li>설치·시공·사후관리</li>
          </ul>
        </div>
      </section>

      <section className={`${styles.sheet} ${styles.products}`} aria-labelledby="profile-products-title">
        <ProfileHeader number="02" label="CAPABILITIES" />
        <div className={styles.titleBlock}>
          <p>PRODUCT RANGE</p>
          <h2 id="profile-products-title">주요 열처리 설비</h2>
        </div>
        <div className={styles.productGrid}>
          {capabilities.map((item) => (
            <article key={item.number}>
              <div className={styles.productImage}>
                <Image src={item.image} alt={`${item.title} 실제 이미지`} fill sizes="92mm" />
              </div>
              <div>
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
        <p className={styles.productFootnote}>프로젝트별 상세 사양과 구성은 공정 조건 검토 후 협의합니다.</p>
      </section>

      <section className={`${styles.sheet} ${styles.proof}`} aria-labelledby="profile-proof-title">
        <ProfileHeader number="03" label="PROOF" dark />
        <div className={`${styles.titleBlock} ${styles.titleBlockDark}`}>
          <p>ACTUAL EQUIPMENT</p>
          <h2 id="profile-proof-title">실제 제작 설비</h2>
        </div>
        <div className={styles.proofGrid}>
          {equipmentGallery.slice(0, 4).map((item, index) => (
            <figure className={index === 0 ? styles.proofFeatured : undefined} key={item.image}>
              <div className={styles.proofImage}>
                <Image src={item.image} alt={`${item.title} — ${item.description}`} fill sizes="190mm" />
              </div>
              <figcaption>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={`${styles.sheet} ${styles.project}`} aria-labelledby="profile-project-title">
        <ProfileHeader number="04" label="PROJECT" />
        <div className={styles.titleBlock}>
          <p>FROM BRIEF TO SITE</p>
          <h2 id="profile-project-title">프로젝트 진행 흐름</h2>
        </div>
        <ol className={styles.projectSteps}>
          {processSteps.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
              <p>{projectDescriptions[index]}</p>
            </li>
          ))}
        </ol>
        <div className={styles.projectClosing}>
          <p>설비 종류와 필요한 작업 범위를 알려주시면 검토할 내용을 함께 정리하겠습니다.</p>
          <div>
            <span>PROJECT INQUIRY</span>
            <strong>sooindustrykorea.com</strong>
            <small>홈페이지 문의 폼에서 프로젝트 정보를 입력해 주세요.</small>
          </div>
        </div>
      </section>
    </article>
  );
}

const projectDescriptions = [
  "필요 설비와 공정 조건을 확인합니다.",
  "요구 조건에 맞는 구성을 설계합니다.",
  "협의된 사양에 따라 설비를 제작합니다.",
  "현장 조건에 맞춰 설치 단계를 진행합니다.",
] as const;

function ProfileHeader({
  dark = false,
  label,
  number,
}: Readonly<{ dark?: boolean; label: string; number: string }>) {
  return (
    <header className={`${styles.profileHeader} ${dark ? styles.profileHeaderDark : ""}`}>
      <span>SOOIN INDUSTRY</span>
      <p>
        {number} · {label}
      </p>
    </header>
  );
}
