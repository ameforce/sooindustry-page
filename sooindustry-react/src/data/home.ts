export type CompanyDetail = Readonly<{
  icon: string;
  label: string;
  value: string;
}>;

export type ServiceCard = Readonly<{
  title: string;
  description: string;
  colClass: string;
  iconClass: string;
  svgMarkup: string;
}>;

const vacuumIconSvg = String.raw`
<svg viewBox="0 0 100 100" style="width: 75px; height: 75px;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="진공로">
  <rect class="vacuum-chamber" x="22" y="22" width="56" height="46" rx="8" fill="none" stroke="#2c3e50" stroke-width="4" />
  <rect class="vacuum-pump" x="8" y="40" width="18" height="16" rx="3" fill="#3498db" stroke="#2980b9" stroke-width="2" />
  <circle class="pressure-gauge" cx="85" cy="28" r="10" fill="#ecf0f1" stroke="#2c3e50" stroke-width="2" />
  <text class="vacuum-text" x="50" y="44" text-anchor="middle" fill="#e74c3c" font-size="10" font-weight="bold">VACUUM</text>
  <text x="50" y="56" text-anchor="middle" fill="#3498db" font-size="8">-760 mmHg</text>
  <rect x="34" y="60" width="32" height="4" fill="#e67e22" />
  <rect x="34" y="67" width="32" height="4" fill="#d35400" />
  <circle cx="16" cy="36" r="3" fill="#27ae60" />
  <circle cx="84" cy="50" r="3" fill="#e74c3c" />
  <rect x="78" y="58" width="14" height="10" fill="#3498db" />
</svg>
`;

const carburizingIconSvg = String.raw`
<svg viewBox="0 0 100 100" style="width: 75px; height: 75px;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="침탄로">
  <rect class="carburizing-chamber" x="20" y="24" width="60" height="44" rx="8" fill="none" stroke="#c0392b" stroke-width="4" />
  <rect class="gas-inlet" x="6" y="36" width="18" height="14" rx="3" fill="#3498db" stroke="#2980b9" stroke-width="2" />
  <text class="carburizing-text" x="50" y="44" text-anchor="middle" fill="#e74c3c" font-size="9" font-weight="bold">CARBURIZING</text>
  <text x="50" y="56" text-anchor="middle" fill="#3498db" font-size="7">850-950degC</text>
  <text x="50" y="66" text-anchor="middle" fill="#2c3e50" font-size="6">Carbon Flow</text>
  <circle cx="84" cy="32" r="4" fill="#e74c3c" />
  <rect x="80" y="58" width="10" height="8" fill="#2c3e50" />
</svg>
`;

const atmosphereIconSvg = String.raw`
<svg viewBox="0 0 100 100" style="width: 75px; height: 75px;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="분위기로">
  <rect class="atmosphere-chamber" x="18" y="22" width="64" height="46" rx="12" fill="none" stroke="#27ae60" stroke-width="4" />
  <rect class="gas-supply" x="4" y="32" width="20" height="16" rx="3" fill="#2ecc71" stroke="#27ae60" stroke-width="2" />
  <text class="atmosphere-text" x="50" y="44" text-anchor="middle" fill="#27ae60" font-size="9" font-weight="bold">ATMOSPHERE</text>
  <text x="50" y="56" text-anchor="middle" fill="#2ecc71" font-size="7">Protective Gas</text>
  <circle cx="32" cy="60" r="2" fill="#2ecc71" opacity="0.8" />
  <circle cx="46" cy="62" r="2" fill="#2ecc71" opacity="0.8" />
  <circle cx="60" cy="60" r="2" fill="#2ecc71" opacity="0.8" />
</svg>
`;

const electricIconSvg = String.raw`
<svg viewBox="0 0 100 100" style="width: 75px; height: 75px;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="전기로">
  <rect class="electric-chamber" x="22" y="24" width="56" height="40" rx="8" fill="#f39c12" stroke="#e67e22" stroke-width="4" />
  <rect class="power-supply" x="6" y="38" width="16" height="14" rx="2" fill="#34495e" stroke="#2c3e50" stroke-width="2" />
  <text class="electric-text" x="50" y="40" text-anchor="middle" fill="#e67e22" font-size="9" font-weight="bold">ELECTRIC</text>
  <text x="50" y="50" text-anchor="middle" fill="#f39c12" font-size="7">1200degC</text>
  <rect class="heating-element" x="32" y="58" width="36" height="4" fill="#e74c3c" />
  <rect x="32" y="66" width="36" height="4" fill="#c0392b" />
  <path d="M44 22 L48 30 L46 30 L49 38 L43 30 L45 30 Z" fill="#f1c40f" />
  <path d="M56 22 L60 30 L58 30 L61 38 L55 30 L57 30 Z" fill="#f1c40f" />
</svg>
`;

const gasNitridingIconSvg = String.raw`
<svg viewBox="0 0 100 100" style="width: 75px; height: 75px;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="가스연질화로">
  <rect class="nitriding-chamber" x="20" y="28" width="60" height="36" rx="8" fill="none" stroke="#3498db" stroke-width="4" />
  <rect class="nitrogen-supply" x="4" y="36" width="18" height="14" rx="3" fill="#3498db" stroke="#2980b9" stroke-width="2" />
  <text class="nitriding-text" x="50" y="44" text-anchor="middle" fill="#3498db" font-size="8" font-weight="bold">GAS NITRIDING</text>
  <text x="50" y="54" text-anchor="middle" fill="#2980b9" font-size="7">520-580degC</text>
  <circle cx="84" cy="30" r="4" fill="#f39c12" />
  <circle cx="84" cy="44" r="4" fill="#f39c12" />
</svg>
`;

const pitFurnaceIconSvg = String.raw`
<svg viewBox="0 0 100 100" style="width: 75px; height: 75px;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="피트로 및 산업로">
  <rect class="pit-structure" x="28" y="18" width="44" height="60" rx="5" fill="#bdc3c7" stroke="#7f8c8d" stroke-width="4" />
  <rect x="32" y="24" width="36" height="6" fill="#e67e22" />
  <rect x="32" y="34" width="36" height="6" fill="#d35400" />
  <rect class="fuel-supply" x="8" y="44" width="18" height="12" rx="3" fill="#f39c12" stroke="#e67e22" stroke-width="2" />
  <text class="pit-text" x="50" y="16" text-anchor="middle" fill="#7f8c8d" font-size="8" font-weight="bold">PIT FURNACE</text>
  <text x="50" y="84" text-anchor="middle" fill="#95a5a6" font-size="7">Deep Heating</text>
  <circle cx="82" cy="34" r="5" fill="#e74c3c" />
</svg>
`;

const machineryIconSvg = String.raw`
<svg viewBox="0 0 100 100" style="width: 75px; height: 75px;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="열처리기계">
  <rect class="machinery-frame" x="20" y="24" width="60" height="44" rx="8" fill="#95a5a6" stroke="#7f8c8d" stroke-width="4" />
  <circle class="main-gear-1" cx="38" cy="46" r="10" fill="none" stroke="#34495e" stroke-width="3" />
  <circle class="main-gear-2" cx="62" cy="46" r="10" fill="none" stroke="#34495e" stroke-width="3" />
  <rect class="control-panel" x="10" y="30" width="12" height="24" rx="2" fill="#2c3e50" />
  <text class="machinery-text" x="50" y="38" text-anchor="middle" fill="#7f8c8d" font-size="8" font-weight="bold">MACHINERY</text>
  <text x="50" y="52" text-anchor="middle" fill="#34495e" font-size="6">Heat Line</text>
  <rect class="motor" x="78" y="34" width="14" height="14" rx="2" fill="#2c3e50" />
</svg>
`;

const batteryIconSvg = String.raw`
<svg viewBox="0 0 100 100" style="width: 75px; height: 75px;" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="2차전지 설비">
  <rect class="battery-line" x="18" y="28" width="64" height="36" rx="8" fill="#3498db" stroke="#2980b9" stroke-width="4" />
  <rect class="battery-cell-1" x="24" y="34" width="8" height="20" fill="#27ae60" stroke="#229954" stroke-width="2" />
  <rect class="battery-cell-2" x="35" y="34" width="8" height="20" fill="#27ae60" stroke="#229954" stroke-width="2" />
  <rect class="battery-cell-3" x="46" y="34" width="8" height="20" fill="#27ae60" stroke="#229954" stroke-width="2" />
  <rect class="battery-cell-4" x="57" y="34" width="8" height="20" fill="#27ae60" stroke="#229954" stroke-width="2" />
  <rect class="battery-cell-5" x="68" y="34" width="8" height="20" fill="#27ae60" stroke="#229954" stroke-width="2" />
  <text class="battery-text" x="50" y="30" text-anchor="middle" fill="#3498db" font-size="8" font-weight="bold">BATTERY LINE</text>
  <text x="50" y="60" text-anchor="middle" fill="#f39c12" font-size="7">Li-ion Process</text>
  <path d="M38 20 L42 26 L40 26 L43 32 L37 26 L39 26 Z" fill="#f1c40f" />
  <path d="M58 20 L62 26 L60 26 L63 32 L57 26 L59 26 Z" fill="#f1c40f" />
  <rect class="production-unit-1" x="10" y="70" width="14" height="12" rx="2" fill="#34495e" />
  <rect class="production-unit-2" x="76" y="70" width="14" height="12" rx="2" fill="#34495e" />
</svg>
`;

export const companyOverview: ReadonlyArray<CompanyDetail> = [
  { icon: "nc-briefcase-24", label: "회사명", value: "수인산업" },
  { icon: "nc-single-02", label: "대표이사", value: "김웅기" },
  { icon: "nc-calendar-60", label: "설립일", value: "2015년 09월 10일" },
  { icon: "nc-trophy", label: "특허", value: "진공로 실용신안 취득" },
];

export const companyFeatureBadges: ReadonlyArray<string> = ["전문 기술력", "품질 보증", "신속한 대응"];

export const serviceCards: ReadonlyArray<ServiceCard> = [
  {
    title: "진공로",
    description: "고품질 진공 열처리",
    colClass: "col-lg-4 col-md-6 mb-4",
    iconClass: "vacuum-icon",
    svgMarkup: vacuumIconSvg,
  },
  {
    title: "침탄로",
    description: "표면 경화 처리",
    colClass: "col-lg-4 col-md-6 mb-4",
    iconClass: "carburizing-icon",
    svgMarkup: carburizingIconSvg,
  },
  {
    title: "분위기로",
    description: "보호 분위기 열처리",
    colClass: "col-lg-4 col-md-6 mb-4",
    iconClass: "atmosphere-icon",
    svgMarkup: atmosphereIconSvg,
  },
  {
    title: "전기로",
    description: "전기식 열처리 설비",
    colClass: "col-lg-4 col-md-6 mb-4",
    iconClass: "electric-icon",
    svgMarkup: electricIconSvg,
  },
  {
    title: "가스연질화로",
    description: "가스 연질화 처리",
    colClass: "col-lg-4 col-md-6 mb-4",
    iconClass: "gas-nitriding-icon",
    svgMarkup: gasNitridingIconSvg,
  },
  {
    title: "피트로 및 각종 산업로",
    description: "다양한 산업용 로 제작",
    colClass: "col-lg-4 col-md-6 mb-4",
    iconClass: "pit-furnace-icon",
    svgMarkup: pitFurnaceIconSvg,
  },
  {
    title: "열처리기계",
    description: "관련 기계 설비",
    colClass: "col-lg-6 col-md-6 mb-4",
    iconClass: "machinery-icon",
    svgMarkup: machineryIconSvg,
  },
  {
    title: "2차전지 설비",
    description: "배터리 산업용 설비",
    colClass: "col-lg-6 col-md-6 mb-4",
    iconClass: "battery-icon",
    svgMarkup: batteryIconSvg,
  },
];

