"use client";

import { useEffect, useRef } from "react";
import { serviceCards } from "@/data/home";

export default function MainBusinessSection() {
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

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
        threshold: 0.45,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="section section-dark" id="main-business">
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center mb-5">
            <h2 className="title">주요 사업 분야</h2>
            <h5 className="description">다양한 열처리 설비 제작 및 전문 서비스</h5>
            <div className="separator-line-light" />
          </div>
        </div>
        <div className="row justify-content-center">
          {serviceCards.map((card, index) => (
            <div key={card.title} className={card.colClass}>
              <div
                className="service-card"
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
              >
                <div
                  className={`service-icon ${card.iconClass}`}
                  dangerouslySetInnerHTML={{ __html: card.svgMarkup }}
                />
                <h4>{card.title}</h4>
                <p>{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
