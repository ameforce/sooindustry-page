import Link from "next/link";
import { heroActions } from "@/data/products";
import MainBusinessSection from "./MainBusinessSection";
import CompanyIntroSection from "./CompanyIntroSection";

export default function HomePage() {
  return (
    <div className="wrapper home-hero-only">
      <div className="page-header section-dark" style={{ backgroundImage: "url('/img/main_02.jpg')" }}>
        <div className="filter" />
        <div className="content-center">
          <div className="container text-center">
            <div className="title-brand">
              <h1 className="presentation-title">SOOIN INDUSTRY</h1>
            </div>
            <h2 className="presentation-subtitle">열처리 산업로의 합리화와 효율화</h2>
            <h3 className="presentation-subtitle-2">수인산업이 앞서갑니다</h3>
            <h4 className="presentation-description">열처리 산업로 제작, 수인산업에게 맡겨 주세요!</h4>

            <div className="main-buttons">
              {heroActions.map((action) => (
                <Link key={action.label} className={action.classes} href={action.href}>
                  <i className={`nc-icon ${action.icon}`} aria-hidden="true" />
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="moving-clouds" style={{ backgroundImage: "url('/img/clouds.png')" }} />
      </div>

      <CompanyIntroSection />

      <MainBusinessSection />

      <div className="section" id="contact-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h2 className="title">문의하기</h2>
              <h5 className="description">수인산업과 함께 성공적인 프로젝트를 만들어보세요</h5>
              <div className="separator-line" />

              <div className="contact-buttons mt-5">
                {heroActions.map((action) => (
                  <Link key={action.label} className={action.classes} href={action.href}>
                    <i className={`nc-icon ${action.icon}`} aria-hidden="true" />
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
