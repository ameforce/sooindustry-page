export type IconFact = Readonly<{
  icon: string;
  label: string;
  value: string;
}>;

export type QuickAction = Readonly<{
  icon: string;
  label: string;
  classes: string;
  href: string;
  ariaLabel?: string;
}>;

export type CustomerPartner = Readonly<{
  name: string;
  description: string;
  icon: string;
}>;

export type DetailItem = Readonly<{
  label: string;
  value: string;
  isHtml?: boolean;
}>;

export type ContactMethod = Readonly<{
  icon: string;
  title: string;
  description: string;
  href: string;
  ariaLabel?: string;
  isExternal?: boolean;
  details: ReadonlyArray<DetailItem>;
}>;

export type AdditionalResource = Readonly<{
  image: string;
  alt: string;
  title: string;
  description: string;
  href?: string;
  downloadName?: string;
  ariaLabel?: string;
}>;

export const companyFacts: ReadonlyArray<IconFact> = [
  { icon: "nc-single-02", label: "대표이사", value: "김웅기" },
  { icon: "nc-calendar-60", label: "설립일", value: "2015년 09월 10일" },
  { icon: "nc-trophy", label: "특허", value: "진공로 실용신안 취득" },
  { icon: "nc-settings-gear-65", label: "주요 사업", value: "열처리 산업로 제작 전문" },
];

export const quickActions: ReadonlyArray<QuickAction> = [
  {
    icon: "nc-mobile",
    label: "전화 문의",
    classes: "btn btn-danger btn-round",
    href: "tel:+82325172473",
    ariaLabel: "032-517-2473로 전화 걸기",
  },
  {
    icon: "nc-email-85",
    label: "이메일 문의",
    classes: "btn btn-outline-danger btn-round",
    href: "mailto:kwg0825@naver.com",
    ariaLabel: "kwg0825@naver.com으로 이메일 보내기",
  },
];

export const customerPartners: ReadonlyArray<CustomerPartner> = [
  { name: "마스터리스트", description: "열처리 전문업체", icon: "nc-settings-gear-65" },
  { name: "한성열처리", description: "금속 열처리 전문", icon: "nc-settings-gear-65" },
  { name: "영동써모텍", description: "써모 기술 전문", icon: "nc-settings-gear-65" },
  { name: "고려금형열처리", description: "금형 열처리 전문", icon: "nc-settings-gear-65" },
  { name: "한양종합열처리", description: "종합 열처리 서비스", icon: "nc-settings-gear-65" },
  { name: "대한열처리", description: "열처리 전문업체", icon: "nc-settings-gear-65" },
  { name: "동신금형열처리", description: "금형 전문 열처리", icon: "nc-settings-gear-65" },
  { name: "화성진공열처리", description: "진공 열처리 전문", icon: "nc-settings-gear-65" },
  { name: "하남열처리", description: "지역 열처리 전문", icon: "nc-settings-gear-65" },
  { name: "대우특수진공", description: "특수 진공 기술", icon: "nc-settings-gear-65" },
  { name: "영동금형열처리", description: "금형 열처리 솔루션", icon: "nc-settings-gear-65" },
  { name: "오토테크인터내셔날", description: "국제 자동차 기술", icon: "nc-settings-gear-65" },
];

export const contactMethods: ReadonlyArray<ContactMethod> = [
  {
    icon: "nc-mobile",
    title: "전화 문의",
    description: "빠른 상담을 원하시면 전화로 연락하세요",
    href: "tel:+82325172473",
    ariaLabel: "032-517-2473로 전화 걸기",
    details: [
      { label: "TEL", value: "032-517-2473" },
      { label: "FAX", value: "032-567-2473" },
    ],
  },
  {
    icon: "nc-email-85",
    title: "이메일 문의",
    description: "자세한 문의사항은 이메일로 보내주세요",
    href: "mailto:kwg0825@naver.com",
    ariaLabel: "kwg0825@naver.com으로 이메일 보내기",
    details: [{ label: "E-mail", value: "kwg0825@naver.com" }],
  },
  {
    icon: "nc-pin-3",
    title: "방문 상담",
    description: "직접 방문하여 상담받으실 수 있습니다",
    href: "https://map.naver.com/p/search/%EC%9D%B8%EC%B2%9C%EA%B4%91%EC%97%AD%EC%8B%9C%20%EC%84%9C%EA%B5%AC%20%EB%A7%88%EC%A4%91%EB%A1%9C142",
    ariaLabel: "네이버 지도에서 위치 보기",
    isExternal: true,
    details: [
      {
        label: "주소",
        value: "인천광역시 서구 마중로142<br>나동 5호 (오류동)",
        isHtml: true,
      },
    ],
  },
];

export const additionalResources: ReadonlyArray<AdditionalResource> = [
  {
    image: "/img/general/misc-2.png",
    alt: "회사 정보",
    title: "회사 소개서",
    description: "상세한 회사 정보 확인",
    href: "/sooin.pdf",
    downloadName: "sooin.pdf",
    ariaLabel: "회사 소개서 PDF 다운로드",
  },
  {
    image: "/img/general/misc-3.png",
    alt: "제품 카탈로그",
    title: "제품 카탈로그",
    description: "전체 제품 라인업 보기",
  },
];
