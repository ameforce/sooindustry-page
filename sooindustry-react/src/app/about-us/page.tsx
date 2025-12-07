const companyDetails = [
  { icon: "nc-bank", title: "회사명", description: "수인산업" },
  { icon: "nc-single-02", title: "경영자", description: "대표이사 김웅기" },
  { icon: "nc-calendar-60", title: "설립일", description: "2015년 09월 10일" },
  { icon: "nc-trophy", title: "특허 및 실용신안", description: "진공로 실용신안 취득" },
];

const businessAreas = [
  { icon: "nc-spaceship", title: "진공로, 침탄로, 분위기로" },
  { icon: "nc-world-2", title: "전기로, 가스연질화로" },
  { icon: "nc-settings-gear-65", title: "열처리기계, 2차전지 설비" },
  { icon: "nc-planet", title: "피트로 및 각종 산업로 제작" },
];

export default function AboutUsPage() {
  return (
    <div className="wrapper">
      <div className="page-header section-dark about-hero-header" style={{ backgroundImage: "url('/img/about-us_01.jpg')" }}>
        <div className="filter" />
        <div className="content-center">
          <div className="container">
            <div className="col-md-8 mx-auto text-center about-hero-text">
              <h2 className="title">수인산업은 이렇습니다</h2>
              <div className="description-wrapper">
                <h5 className="description-main">열처리 산업로 분야 전문 연구개발</h5>
                <p className="description-detail">
                  고객 맞춤형 설비 제작부터 설치, 시공, 사후관리까지 원스톱 서비스를 제공하며, 철저한 품질관리로 고객
                  만족을 실현합니다.
                </p>
                <p className="description-detail">
                  자금조달, 기술, 품질, A/S, 영업 등 고객의 모든 애로사항을 해결할 수 있는 통합 솔루션 네트워크를
                  보유하고 있습니다.
                </p>
              </div>
              <br />
              <a className="btn btn-danger btn-round btn-lg about-hero-btn" href="#company-info">
                <i className="nc-icon nc-bank" aria-hidden="true" />
                회사 정보 보기
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="section text-center" id="company-info">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-12 text-center mb-5">
              <h2 className="title">회사 개요</h2>
              <h5 className="description">수인산업 기본 정보</h5>
              <div className="separator-line" />
            </div>
          </div>
          <div className="row justify-content-center">
            {companyDetails.map((detail) => (
              <div key={detail.title} className="col-md-6 mb-4">
                <div className="company-detail">
                  <div className="detail-icon">
                    <i className={`nc-icon ${detail.icon}`} aria-hidden="true" />
                  </div>
                  <h4>{detail.title}</h4>
                  <p>{detail.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section text-center">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center mb-5">
              <h2 className="title">사업 분야</h2>
              <h5 className="description">다양한 열처리 설비 제조</h5>
              <div className="separator-line" />
            </div>
          </div>
          <div className="row">
            {businessAreas.map((area) => (
              <div key={area.title} className="col-md-6 col-lg-3 mb-4">
                <div className="business-item">
                  <div className="business-icon">
                    <i className={`nc-icon ${area.icon}`} aria-hidden="true" />
                  </div>
                  <h4>{area.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
