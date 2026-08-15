export type Capability = Readonly<{
  number: string;
  title: string;
  description: string;
  image: string;
}>;

export type EquipmentImage = Readonly<{
  image: string;
  title: string;
  description: string;
  featured?: boolean;
}>;

export const capabilities: ReadonlyArray<Capability> = [
  {
    number: "01",
    title: "진공열처리로",
    description: "실제 설비 이미지로 제품군과 구성 형태를 확인할 수 있습니다.",
    image: "/img/products/vacuum-heat-treatment-1.jpeg",
  },
  {
    number: "02",
    title: "가스연질화로",
    description: "가스 연질화 공정에 사용하는 열처리 설비를 안내합니다.",
    image: "/img/products/gas-nitriding-furnace.jpeg",
  },
  {
    number: "03",
    title: "전기로 및 대차로",
    description: "전기식 열처리 설비의 실제 제작 이미지를 확인할 수 있습니다.",
    image: "/img/products/electric-furnace.jpeg",
  },
  {
    number: "04",
    title: "침탄열처리로",
    description: "침탄 열처리 공정 설비의 형태와 작업 범위를 소개합니다.",
    image: "/img/products/carburizing-1.jpeg",
  },
];

export const equipmentGallery: ReadonlyArray<EquipmentImage> = [
  {
    image: "/img/equipment/vacuum-line-pair.jpg",
    title: "진공열처리 설비 라인",
    description: "2기 설비와 제어반을 함께 구성한 현장 전경",
    featured: true,
  },
  {
    image: "/img/equipment/vacuum-system-rear.jpg",
    title: "진공 계통 및 배관 구성",
    description: "펌프와 배관 계통을 확인할 수 있는 후면 구성",
  },
  {
    image: "/img/equipment/vacuum-chamber-interior.jpg",
    title: "진공로 내부 챔버",
    description: "가열부와 지그 구조를 확인할 수 있는 내부",
  },
  {
    image: "/img/general/misc-1.jpg",
    title: "열처리 산업로",
    description: "실제 설비 및 제어부",
  },
  {
    image: "/img/general/misc-4.webp",
    title: "설비 내부",
    description: "챔버 내부 구성",
  },
  {
    image: "/img/general/misc-5.webp",
    title: "제어 화면",
    description: "설비 운전 인터페이스",
  },
  {
    image: "/img/products/vacuum-heat-treatment-2.jpeg",
    title: "진공열처리로",
    description: "제품군 실제 이미지",
  },
  {
    image: "/img/products/carburizing-2.webp",
    title: "열처리 공정 설비",
    description: "공정 설비 실제 이미지",
  },
];

export const processSteps = ["상담", "설계", "제작", "설치"] as const;

export const processDescriptions = [
  "필요 설비와 공정 조건, 작업 범위를 함께 확인합니다.",
  "협의한 조건을 바탕으로 설비 구성과 제어 방식을 설계합니다.",
  "설계 내용을 기준으로 열처리 설비와 제어부를 제작합니다.",
  "현장 조건에 맞춰 설치·시공하고 사후관리 범위를 안내합니다.",
] as const;
