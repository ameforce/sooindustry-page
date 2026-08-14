import Image from "next/image";
import Link from "next/link";
import { capabilities, equipmentGallery, processSteps } from "@/data/precisionProof";
import { ContactForm } from "./contact-form";
import { MotionDirector } from "./motion-director";
import styles from "./precision-home.module.scss";

export function PrecisionHome() {
  return (
    <div className={styles.page} id="precision-home">
      <MotionDirector scopeId="precision-home" />
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroCopy} data-reveal>
          <p className={styles.eyebrow}>SOOIN INDUSTRY</p>
          <h1 id="hero-title">
            공정에 맞춘
            <br />
            열처리 산업로
          </h1>
          <p className={styles.lead}>
            상담부터 설계, 제작, 설치까지. 수인산업은 실제 제작 설비를 근거로 필요한 열처리 시스템을 함께
            검토합니다.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryButton} href="#equipment">
              실제 설비 보기 <span aria-hidden="true">↗</span>
            </Link>
            <Link className={styles.secondaryButton} href="#contact">
              문의하기
            </Link>
          </div>
          <dl className={styles.heroIndex} aria-label="홈페이지 주요 정보">
            <div>
              <dt>01</dt>
              <dd>주문형 설비</dd>
            </div>
            <div>
              <dt>02</dt>
              <dd>제작 사례 공개</dd>
            </div>
            <div>
              <dt>03</dt>
              <dd>설계부터 설치까지</dd>
            </div>
          </dl>
        </div>
        <div className={styles.heroVisual} data-reveal>
          <Image
            src="/img/general/misc-3.webp"
            alt="수인산업 열처리 산업로 실제 설비"
            fill
            loading="eager"
            sizes="(max-width: 900px) 100vw, 50vw"
          />
          <div className={styles.imageLabel}>
            <span>ACTUAL EQUIPMENT</span>
            <strong>설비 · 제어 · 현장</strong>
          </div>
        </div>
      </section>

      <aside className={styles.trustBar} aria-label="수인산업 프로젝트 대응 범위" data-reveal>
        <p>ENGINEERING SCOPE</p>
        <ul>
          <li>고객 공정 조건 검토</li>
          <li>열처리 설비 설계·제작</li>
          <li>설치·시공·사후관리</li>
        </ul>
      </aside>

      <section className={styles.intro} id="company" aria-labelledby="company-title" data-reveal>
        <SectionHeading number="01" label="ABOUT" title="설비를 먼저 보여주는 회사 소개" id="company-title" />
        <div className={styles.introGrid}>
          <p className={styles.introLead}>열처리 산업로 제작, 수인산업에게 맡겨 주세요.</p>
          <div className={styles.introBody}>
            <p>
              수인산업은 진공로, 침탄로, 분위기로, 전기로와 가스연질화로 등 열처리 산업로를 설계·제작합니다.
            </p>
            <p>
              장식적인 설명보다 실제 제작 설비와 확인 가능한 제품군을 중심으로 작업 범위를 소개하고, 프로젝트
              조건에 맞춰 설치·시공·사후관리 단계를 안내합니다.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.capabilities} id="capabilities" aria-labelledby="capabilities-title" data-reveal>
        <SectionHeading number="02" label="CAPABILITIES" title="주요 열처리 설비" id="capabilities-title" />
        <div className={styles.cardGrid}>
          {capabilities.map((item) => (
            <article className={styles.capabilityCard} key={item.number} data-reveal>
              <div className={styles.cardImage}>
                <Image src={item.image} alt={`${item.title} 실제 이미지`} fill sizes="(max-width: 700px) 100vw, 25vw" />
              </div>
              <span className={styles.cardNumber}>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link href="#contact" aria-label={`${item.title} 설비 문의`}>
                설비 문의 <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.equipment} id="equipment" aria-labelledby="equipment-title" data-reveal>
        <div className={styles.equipmentHeading}>
          <SectionHeading number="03" label="PROOF" title="실제 설비로 확인하세요" id="equipment-title" dark />
          <p>기존 홈페이지에 등록된 수인산업의 실제 설비 사진을 그대로 사용했습니다.</p>
        </div>
        <div className={styles.gallery}>
          {equipmentGallery.map((item) => (
            <figure
              className={item.featured ? styles.featuredFigure : styles.figure}
              key={item.image}
              data-reveal
            >
              <div className={styles.galleryImage}>
                <Image src={item.image} alt={`${item.title} — ${item.description}`} fill sizes={item.featured ? "(max-width: 900px) 100vw, 58vw" : "(max-width: 900px) 50vw, 21vw"} />
              </div>
              <figcaption>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={styles.process} id="process" aria-labelledby="process-title" data-reveal>
        <SectionHeading number="04" label="PROCESS" title="프로젝트 진행 흐름" id="process-title" />
        <ol className={styles.processList}>
          {processSteps.map((step, index) => (
            <li key={step} data-reveal>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
        <p className={styles.processNote}>프로젝트 범위와 설비 조건에 따라 필요한 단계와 진행 순서를 안내합니다.</p>
      </section>

      <section className={styles.contact} id="contact" aria-labelledby="contact-title" data-reveal>
        <div className={styles.contactCopy}>
          <p className={styles.eyebrowLight}>05 · CONTACT</p>
          <h2 id="contact-title">열처리 산업로 제작을 상담해 보세요.</h2>
          <p>
            설비 종류와 필요한 작업 범위를 남기면 검토할 내용을 미리 정리할 수 있습니다. 현재 문의 폼은 실제 전송
            연결 전 프리뷰입니다.
          </p>
          <Link href="/sooin.pdf" download>
            회사 소개서 내려받기 <span aria-hidden="true">↓</span>
          </Link>
        </div>
        <ContactForm />
      </section>
    </div>
  );
}

function SectionHeading({
  dark = false,
  id,
  label,
  number,
  title,
}: Readonly<{
  dark?: boolean;
  id: string;
  label: string;
  number: string;
  title: string;
}>) {
  return (
    <div className={`${styles.sectionHeading} ${dark ? styles.sectionHeadingDark : ""}`}>
      <p>
        <span>{number}</span> {label}
      </p>
      <h2 id={id}>{title}</h2>
    </div>
  );
}
