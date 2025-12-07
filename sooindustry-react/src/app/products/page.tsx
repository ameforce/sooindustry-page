"use client";

import { useRef, useState } from "react";
import {
  carbonGallery,
  carbonProducts,
  furnaceLineup,
  heroActions,
  molyGallery,
  molyProducts,
  oringProducts,
  processSteps,
  productContactActions,
  vacuumFeatures,
} from "@/data/products";
import { ImageModal } from "../_components/image-modal";

type ModalState = {
  open: boolean;
  image: string;
  title: string;
  items?: Array<{ image: string; title: string }>;
  index?: number;
};

export default function ProductsPage() {
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    image: "",
    title: "",
    items: undefined,
    index: undefined,
  });
  const carbonGalleryRef = useRef<HTMLDivElement | null>(null);
  const molyGalleryRef = useRef<HTMLDivElement | null>(null);

  const handleOpenModal = (image: string, title: string) => {
    if (!image) return;
    setModalState({ open: true, image, title, items: undefined, index: undefined });
  };

  const handleCloseModal = () => {
    setModalState({ open: false, image: "", title: "", items: undefined, index: undefined });
  };

  const scrollGallery = (ref: React.RefObject<HTMLDivElement | null>, direction: number) => {
    const node = ref.current;
    if (!node) return;
    const amount = node.clientWidth * 0.8;
    const maxScroll = node.scrollWidth - node.clientWidth;
    const target = Math.max(0, Math.min(node.scrollLeft + direction * amount, maxScroll));
    node.scrollTo({ left: target, behavior: "smooth" });
  };

  const handleOpenModalWithList = (
    items: Array<{ image: string; title: string }>,
    index: number,
  ) => {
    const safeIndex = Math.max(0, Math.min(index, items.length - 1));
    const item = items[safeIndex];
    setModalState({
      open: true,
      image: item.image,
      title: item.title,
      items,
      index: safeIndex,
    });
  };

  const handleStep = (direction: 1 | -1) => {
    if (!modalState.items || modalState.index === undefined) return;
    const total = modalState.items.length;
    if (total === 0) return;
    const nextIndex = (modalState.index + direction + total) % total;
    const nextItem = modalState.items[nextIndex];
    setModalState({
      open: true,
      image: nextItem.image,
      title: nextItem.title,
      items: modalState.items,
      index: nextIndex,
    });
  };

  return (
    <div className="wrapper">
      <div
        className="page-header page-header-xs"
        style={{ backgroundImage: "url('/img/Vacuum-Heat-Treatment_01.jpg')" }}
      >
        <div className="filter" />
        <div className="content-center">
          <div className="container text-center">
            <h1 className="title">제품 소개</h1>
            <h4 className="description">진공 열처리와 소재 솔루션</h4>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <h2 className="product-title">진공열처리 핵심 특징</h2>
              <p className="product-subtitle">고객 요구사항을 만족시키는 고성능 열처리 공정</p>
              <div className="features-list">
                {vacuumFeatures.map((feature) => (
                  <div key={feature} className="feature-item">
                    <i className="nc-icon nc-check-2" aria-hidden="true" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-5 product-image-gallery mt-4 mt-lg-0">
              <img
                src="/img/products/vacuum-heat-treatment-2.jpeg"
                alt="진공열처리"
                className="main-product-image"
                onClick={() => handleOpenModal("/img/products/vacuum-heat-treatment-2.jpeg", "진공열처리")}
                role="button"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="section section-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="title">열처리 설비 라인업</h2>
            <div className="separator-line" />
          </div>
          <div className="row">
            {furnaceLineup.map((card) => (
              <div key={card.title} className={card.colClass}>
                <div className="card card-product">
                  <div className="card-header">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="card-img"
                      loading="lazy"
                      onClick={() => handleOpenModal(card.image, card.title)}
                      role="button"
                    />
                  </div>
                  <div className="card-body">
                    <h4 className="card-title">{card.title}</h4>
                    <p className="card-description">{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="title">오링 제품군</h2>
            <div className="separator-line" />
          </div>
          <div className="row">
            {oringProducts.map((card) => (
              <div key={card.title} className={card.colClass}>
                <div className="card card-product">
                  <div className="card-header">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="card-img"
                      loading="lazy"
                      onClick={() => handleOpenModal(card.image, card.title)}
                      role="button"
                    />
                  </div>
                  <div className="card-body">
                    <h4 className="card-title">{card.title}</h4>
                    <p className="card-description">{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section section-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="title">카본 소재 라인업</h2>
            <div className="separator-line" />
          </div>
          <div className="row">
            {carbonProducts.map((card) => (
              <div key={card.title} className={card.colClass}>
                <div className="card card-product">
                  <div className="card-header">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="card-img"
                      loading="lazy"
                      onClick={() => handleOpenModal(card.image, card.title)}
                      role="button"
                    />
                  </div>
                  <div className="card-body">
                    <h4 className="card-title">{card.title}</h4>
                    <p className="card-description">{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="gallery-scroll-wrapper">
            <button
              type="button"
              className="gallery-nav prev"
              aria-label="이전 이미지"
              onClick={() => scrollGallery(carbonGalleryRef, -1)}
            >
              ‹
            </button>
            <div className="gallery-scroll" ref={carbonGalleryRef}>
            {carbonGallery.map((item, index) => (
                <div key={item.image} className="gallery-card">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="gallery-image"
                    loading="lazy"
                    onClick={() =>
                      handleOpenModalWithList(
                        carbonGallery.map((g) => ({ image: g.image, title: g.title })),
                        index,
                      )
                    }
                    role="button"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              className="gallery-nav next"
              aria-label="다음 이미지"
              onClick={() => scrollGallery(carbonGalleryRef, 1)}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="title">몰리브덴 · 텅스텐 가공품</h2>
            <div className="separator-line" />
          </div>
          <div className="row">
            {molyProducts.map((card) => (
              <div key={card.title} className={card.colClass}>
                <div className="card card-product">
                  <div className="card-header">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="card-img"
                      loading="lazy"
                      onClick={() => handleOpenModal(card.image, card.title)}
                      role="button"
                    />
                  </div>
                  <div className="card-body">
                    <h4 className="card-title">{card.title}</h4>
                    <p className="card-description">{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="gallery-scroll-wrapper">
            <button
              type="button"
              className="gallery-nav prev"
              aria-label="이전 이미지"
              onClick={() => scrollGallery(molyGalleryRef, -1)}
            >
              ‹
            </button>
            <div className="gallery-scroll" ref={molyGalleryRef}>
            {molyGallery.map((item, index) => (
              <div key={item.image} className="gallery-card">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="gallery-image"
                    loading="lazy"
                  onClick={() =>
                    handleOpenModalWithList(
                      molyGallery.map((g) => ({ image: g.image, title: g.title })),
                      index,
                    )
                  }
                    role="button"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              className="gallery-nav next"
              aria-label="다음 이미지"
              onClick={() => scrollGallery(molyGalleryRef, 1)}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <div className="section section-dark">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="title">프로세스 플로우</h2>
            <div className="separator-line-light" />
          </div>
          <div className="row process-flow">
          {processSteps.map((step, index) => (
            <>
              <div key={step.step} className="col-lg-6 mb-4">
                <div className="process-step large-step">
                  <div className="step-number">{step.step}</div>
                  <div className={`step-content ${step.wrapperClass}`}>
                    <div className="row">
                      {step.images.map((img) => (
                        <div key={img.image} className="col-12 mb-3">
                          <img
                            src={img.image}
                            alt={img.alt}
                            loading="lazy"
                            onClick={() => handleOpenModal(img.image, img.alt)}
                            role="button"
                          />
                        </div>
                      ))}
                    </div>
                    <h5>{step.title}</h5>
                    <p>{step.description}</p>
                  </div>
                </div>
              </div>
              {index < processSteps.length - 1 && (
                <div className="col-12 d-lg-none">
                  <div className="process-arrow-mobile" aria-hidden="true">
                    ↓
                  </div>
                </div>
              )}
            </>
          ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="text-center">
            <h2 className="title">제품 문의</h2>
            <div className="separator-line" />
            <div className="contact-buttons mt-4">
              {productContactActions.map((action) => (
                <a key={action.label} href={action.href} className={action.classes}>
                  <i className={`nc-icon ${action.icon}`} aria-hidden="true" />
                  {action.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ImageModal
        open={modalState.open}
        image={modalState.image}
        title={modalState.title}
        onClose={handleCloseModal}
        onPrev={
          modalState.items && modalState.items.length > 1 && modalState.index !== undefined
            ? () => handleStep(-1)
            : undefined
        }
        onNext={
          modalState.items && modalState.items.length > 1 && modalState.index !== undefined
            ? () => handleStep(1)
            : undefined
        }
      />
    </div>
  );
}
