"use client";

import { useEffect, useRef } from "react";
import { companyFeatureBadges, companyOverview } from "@/data/home";

export default function CompanyIntroSection() {
  const imageRef = useRef<HTMLDivElement | null>(null);
  const infoRefs = useRef<Array<HTMLDivElement | null>>([]);
  const featureRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            target.classList.add("is-active");
          } else {
            target.classList.remove("is-active");
          }
        });
      },
      {
        threshold: 0.6,
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    infoRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    featureRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="section" id="company-intro">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center mb-5">
            <h2 className="title">수인산업 소개</h2>
            <h5 className="description">열처리 산업로 전문 제조업체로서 고품질 솔루션을 제공합니다</h5>
            <div className="separator-line" />
          </div>
        </div>
        <div className="row align-items-center">
          <div className="col-md-6 mb-4">
            <div className="company-image-wrapper" ref={imageRef}>
              <img
                src="/img/general/misc-3.png"
                alt="수인산업"
                className="img-fluid rounded shadow"
                loading="lazy"
              />
              <div className="image-overlay">
                <div className="overlay-text">
                  <i className="nc-icon nc-settings-gear-65" aria-hidden="true" />
                  <p>첨단 기술과 전문성</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="company-details">
              <h3 className="company-title">
                <i className="nc-icon nc-building" aria-hidden="true" />
                회사 개요
              </h3>
              <div className="company-info-enhanced">
                {companyOverview.map((detail, index) => (
                  <div
                    key={detail.label}
                    className="info-item"
                    ref={(el) => {
                      infoRefs.current[index] = el;
                    }}
                  >
                    <div className="info-icon">
                      <i className={`nc-icon ${detail.icon}`} aria-hidden="true" />
                    </div>
                    <div className="info-content">
                      <strong>{detail.label}</strong>
                      <span>{detail.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="company-features mt-4">
                {companyFeatureBadges.map((badge, index) => (
                  <div
                    key={badge}
                    className="feature-badge"
                    ref={(el) => {
                      featureRefs.current[index] = el;
                    }}
                  >
                    <i className="nc-icon nc-check-2" aria-hidden="true" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
