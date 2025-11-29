import {
  additionalResources,
  companyFacts,
  contactMethods,
  customerPartners,
  quickActions,
} from "@/data/customerSupport";

export default function CustomerSupportPage() {
  return (
    <div className="wrapper">
      <div
        className="page-header page-header-xs"
        style={{ backgroundImage: "url('/img/general/misc-1.jpg')" }}
        data-parallax="true"
      >
        <div className="filter" />
        <div className="content-center">
          <div className="container">
            <h1 className="title">연락처 및 고객지원</h1>
            <h4 className="description">수인산업과 함께하세요</h4>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center mb-5">
              <h2 className="title">연락처 정보</h2>
              <h5 className="description">수인산업에 언제든지 문의해 주세요</h5>
              <div className="separator-line" />
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-md-6 mb-4">
              <div className="company-info-card">
                <div className="card-header">
                  <h3 className="company-title">
                    <i className="nc-icon nc-bank" aria-hidden="true" />
                    수인산업
                  </h3>
                </div>
                <div className="card-body">
                  <div className="contact-info">
                    {companyFacts.map((fact) => (
                      <div key={fact.label} className="contact-item">
                        <div className="contact-icon">
                          <i className={`nc-icon ${fact.icon}`} aria-hidden="true" />
                        </div>
                        <div className="contact-content">
                          <strong>{fact.label}</strong>
                          <span>{fact.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="quick-contact-buttons mt-4">
                    {quickActions.map((action) => (
                      <button key={action.label} type="button" className={action.classes}>
                        <i className={`nc-icon ${action.icon}`} aria-hidden="true" />
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="contact-image-wrapper">
                <img
                  src="/img/general/customer-card.png"
                  alt="고객관리카드"
                  className="img-fluid rounded shadow"
                  loading="lazy"
                />
                <div className="image-overlay">
                  <div className="overlay-text">
                    <i className="nc-icon nc-check-2" aria-hidden="true" />
                    <p>체계적인 고객 관리</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section section-light">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center mb-5">
              <h2 className="title">주요 고객사</h2>
              <h5 className="description">신뢰할 수 있는 파트너십</h5>
              <div className="separator-line" />
            </div>
          </div>

          <div className="row">
            {customerPartners.map((partner) => (
              <div key={partner.name} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div className="customer-card">
                  <div className="customer-icon">
                    <i className={`nc-icon ${partner.icon}`} aria-hidden="true" />
                  </div>
                  <h5>{partner.name}</h5>
                  <p>{partner.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center mb-5">
              <h2 className="title">문의 방법</h2>
              <h5 className="description">다양한 방법으로 연락하실 수 있습니다</h5>
              <div className="separator-line" />
            </div>
          </div>

          <div className="row">
            {contactMethods.map((method) => (
              <div key={method.title} className="col-md-4 mb-4">
                <div className="contact-method">
                  <div className="method-icon">
                    <i className={`nc-icon ${method.icon}`} aria-hidden="true" />
                  </div>
                  <h4>{method.title}</h4>
                  <p>{method.description}</p>
                  <div className="contact-details">
                    {method.details.map((detail) => (
                      <div key={detail.label} className="contact-detail-item">
                        <strong>{detail.label}</strong>
                        {detail.isHtml ? (
                          <span
                            className="address-text"
                            dangerouslySetInnerHTML={{ __html: detail.value }}
                          />
                        ) : (
                          <span>{detail.value}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section section-dark">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <h2 className="title">추가 정보</h2>
              <h5 className="description">수인산업에 대한 더 많은 정보를 확인하세요</h5>
              <div className="separator-line-light" />

              <div className="additional-info mt-5">
                <div className="row">
                  {additionalResources.map((resource) => (
                    <div key={resource.title} className="col-md-6 mb-4">
                      <div className="info-showcase">
                        <img src={resource.image} alt={resource.alt} className="img-fluid rounded" loading="lazy" />
                        <h5 className="mt-3">{resource.title}</h5>
                        <p>{resource.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="final-cta mt-5">
                <a href="/products" className="btn btn-danger btn-round btn-lg mr-3">
                  <i className="nc-icon nc-app" aria-hidden="true" />
                  제품 보기
                </a>
                <a href="/about-us" className="btn btn-outline-light btn-round btn-lg">
                  <i className="nc-icon nc-bank" aria-hidden="true" />
                  회사 소개
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
