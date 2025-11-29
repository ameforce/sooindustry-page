export type NavLink = Readonly<{
  href: string;
  label: string;
  icon: string;
}>;

export const navLinks: ReadonlyArray<NavLink> = [
  { href: "/home", label: "홈", icon: "nc-icon nc-shop" },
  { href: "/about-us", label: "회사 소개", icon: "nc-icon nc-bank" },
  { href: "/products", label: "제품 소개", icon: "nc-icon nc-box" },
  { href: "/customer-support", label: "고객 지원", icon: "nc-icon nc-satisfied" },
  { href: "/icon-demo", label: "아이콘", icon: "nc-icon nc-app" },
];
