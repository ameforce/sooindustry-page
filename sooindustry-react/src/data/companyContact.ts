const mapSearchQuery = encodeURIComponent("수인산업 인천광역시 서구 마중로 142 나동 5호");

export const companyContact = {
  phoneDisplay: "032-517-2473",
  phoneHref: "tel:+82325172473",
  addressLine1: "인천광역시 서구 마중로 142",
  addressLine2: "나동 5호 (오류동)",
  naverMapHref: `https://map.naver.com/p/search/${mapSearchQuery}`,
  kakaoMapHref: `https://map.kakao.com/?q=${mapSearchQuery}`,
} as const;
