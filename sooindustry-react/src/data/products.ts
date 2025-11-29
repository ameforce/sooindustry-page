export type ProductCard = Readonly<{
  image: string;
  title: string;
  description: string;
  colClass: string;
}>;

export type GalleryItem = Readonly<{
  image: string;
  alt: string;
  title: string;
  colClass: string;
}>;

export type ProcessStepImage = Readonly<{
  image: string;
  alt: string;
}>;

export type ProcessStep = Readonly<{
  step: number;
  title: string;
  description: string;
  wrapperClass: "installation-images" | "completion-images";
  images: ReadonlyArray<ProcessStepImage>;
}>;

export type ContactButton = Readonly<{
  label: string;
  icon: string;
  href: string;
  classes: string;
}>;

export const vacuumFeatures: ReadonlyArray<string> = [
  "제품의 변형과 치수 변화를 최소화",
  "최소 질소량 투입으로 질소 피막 형성 방지",
  "제품의 광택 연삭효율 증대",
  "빠른 냉각 시스템으로 경도 안정",
  "제품 얼룩제거 및 조직 균일화",
];

export const furnaceLineup: ReadonlyArray<ProductCard> = [
  {
    image: "/img/products/vacuum-heat-treatment-1.jpeg",
    title: "진공열처리로",
    description: "고품질 진공 열처리 설비",
    colClass: "col-lg-4 col-md-6 mb-4",
  },
  {
    image: "/img/products/gas-nitriding-furnace.jpeg",
    title: "가스연질화로",
    description: "가스 연질화 처리 설비",
    colClass: "col-lg-4 col-md-6 mb-4",
  },
  {
    image: "/img/products/electric-furnace.jpeg",
    title: "전기로 및 대차로",
    description: "전기식 열처리 설비",
    colClass: "col-lg-4 col-md-6 mb-4",
  },
  {
    image: "/img/products/carburizing-1.jpeg",
    title: "침탄열처리로",
    description: "침탄열처리, 가스질화, 소둔, 조질, 고주파",
    colClass: "col-lg-6 col-md-6 mb-4",
  },
  {
    image: "/img/products/carburizing-2.png",
    title: "열처리 공정 설비",
    description: "다양한 열처리 공정 장비",
    colClass: "col-lg-6 col-md-6 mb-4",
  },
];

export const oringProducts: ReadonlyArray<ProductCard> = [
  {
    image: "/img/products/standard-oring.jpeg",
    title: "규격별 오링",
    description: "표준 규격 오링 제품",
    colClass: "col-lg-4 col-md-6 mb-4",
  },
  {
    image: "/img/products/large-oring.png",
    title: "대구경 오링",
    description: "대형 규격 오링 제품",
    colClass: "col-lg-4 col-md-6 mb-4",
  },
  {
    image: "/img/products/cord-oring.jpeg",
    title: "줄 오링",
    description: "코드형 오링 제품",
    colClass: "col-lg-4 col-md-6 mb-4",
  },
];

export const carbonProducts: ReadonlyArray<ProductCard> = [
  {
    image: "/img/products/carbon-insulation.png",
    title: "카본 단열재",
    description: "고온용 카본 단열재",
    colClass: "col-lg-4 col-md-6 mb-4",
  },
  {
    image: "/img/products/carbon-sheet.png",
    title: "카본 씨트",
    description: "다용도 카본 시트",
    colClass: "col-lg-4 col-md-6 mb-4",
  },
  {
    image: "/img/products/carbon-processing-1.jpeg",
    title: "각종 카본 가공품",
    description: "맞춤형 카본 가공 제품",
    colClass: "col-lg-4 col-md-6 mb-4",
  },
];

export const carbonGallery: ReadonlyArray<GalleryItem> = [
  {
    image: "/img/products/carbon-processing-2.jpeg",
    alt: "카본 가공품",
    title: "카본 가공품",
    colClass: "col-lg-2 col-md-4 col-6 mb-3",
  },
  {
    image: "/img/products/carbon-processing-3.jpeg",
    alt: "카본 가공품",
    title: "카본 가공품",
    colClass: "col-lg-2 col-md-4 col-6 mb-3",
  },
  {
    image: "/img/products/carbon-processing-4.jpeg",
    alt: "카본 가공품",
    title: "카본 가공품",
    colClass: "col-lg-2 col-md-4 col-6 mb-3",
  },
  {
    image: "/img/products/carbon-processing-5.jpeg",
    alt: "카본 가공품",
    title: "카본 가공품",
    colClass: "col-lg-2 col-md-4 col-6 mb-3",
  },
  {
    image: "/img/products/carbon-processing-6.jpeg",
    alt: "카본 가공품",
    title: "카본 가공품",
    colClass: "col-lg-2 col-md-4 col-6 mb-3",
  },
];

export const molyProducts: ReadonlyArray<ProductCard> = [
  {
    image: "/img/products/molybdenum-tungsten-1.jpeg",
    title: "몰리브덴 가공품",
    description: "고온용 몰리브덴 제품",
    colClass: "col-lg-6 col-md-6 mb-4",
  },
  {
    image: "/img/products/molybdenum-tungsten-2.jpeg",
    title: "텅스텐 가공품",
    description: "고밀도 텅스텐 제품",
    colClass: "col-lg-6 col-md-6 mb-4",
  },
];

export const molyGallery: ReadonlyArray<GalleryItem> = [
  {
    image: "/img/products/molybdenum-tungsten-3.jpeg",
    alt: "몰리브덴 텅스텐 가공품",
    title: "몰리브덴 텅스텐 가공품",
    colClass: "col-lg-3 col-md-6 col-6 mb-3",
  },
  {
    image: "/img/products/molybdenum-tungsten-4.jpeg",
    alt: "몰리브덴 텅스텐 가공품",
    title: "몰리브덴 텅스텐 가공품",
    colClass: "col-lg-3 col-md-6 col-6 mb-3",
  },
];

export const processSteps: ReadonlyArray<ProcessStep> = [
  {
    step: 1,
    title: "설치 과정",
    description: "전문적인 설치 서비스 및 정밀한 설계",
    wrapperClass: "installation-images",
    images: [
      { image: "/img/vietnam/construction-1.jpeg", alt: "설치 과정 1" },
      { image: "/img/general/misc-4.png", alt: "설치 과정 2" },
    ],
  },
  {
    step: 2,
    title: "시공 완료",
    description: "성공적인 프로젝트 완료 및 제작 과정",
    wrapperClass: "completion-images",
    images: [
      { image: "/img/vietnam/construction-2.png", alt: "시공 완료 1" },
      { image: "/img/vietnam/construction-3.jpeg", alt: "시공 완료 2" },
    ],
  },
];

export const heroActions: ReadonlyArray<ContactButton> = [
  {
    icon: "nc-chat-33",
    label: "연락처 보기",
    href: "/customer-support",
    classes: "btn btn-danger btn-round btn-lg",
  },
  {
    icon: "nc-bank",
    label: "회사 소개",
    href: "/about-us",
    classes: "btn btn-outline-danger btn-round btn-lg",
  },
  {
    icon: "nc-app",
    label: "제품 보기",
    href: "/products",
    classes: "btn btn-outline-danger btn-round btn-lg",
  },
];

export const productContactActions: ReadonlyArray<ContactButton> = [
  {
    icon: "nc-chat-33",
    label: "문의하기",
    href: "/customer-support",
    classes: "btn btn-danger btn-round btn-lg",
  },
  {
    icon: "nc-bank",
    label: "회사 소개",
    href: "/about-us",
    classes: "btn btn-outline-danger btn-round btn-lg",
  },
];
