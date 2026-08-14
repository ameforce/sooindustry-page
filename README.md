# SOOIN Industry 웹사이트

수인산업 공식 웹사이트입니다. Next.js 16 App Router를 사용하며, 빌드 결과물은 서버 런타임이 필요 없는 정적 사이트로 Cloudflare Pages에 배포합니다.

## 기술 구성

- Next.js 16 + React 19 + TypeScript
- SCSS, Bootstrap, Paper Kit 자산
- Next.js static export (`sooindustry-react/out`)
- Cloudflare Pages 정적 호스팅
- 운영 도메인: `https://sooindustrykorea.com`

## 로컬 개발과 검증

Node.js 버전은 루트의 `.nvmrc`를 따릅니다.

```bash
cd sooindustry-react
npm ci
npm run dev
```

전체 검증은 테스트, ESLint, 타입 검사, static export 빌드, Pages 동작을 모사한 HTTP 스모크 순으로 실행됩니다.

```bash
npm run check
```

빌드된 정적 사이트만 별도로 확인하려면 다음 명령을 사용합니다.

```bash
npm run build
npm run preview
```

로컬 프리뷰 기본 주소는 `http://127.0.0.1:3000`입니다. 실제 완료 판정에는 390 / 768 / 1024 / 1440px 브라우저 QA도 포함합니다.

## Cloudflare Pages 배포

Cloudflare Pages의 Git 연동 설정은 다음과 같습니다.

| 항목 | 값 |
| --- | --- |
| Root directory | `sooindustry-react` |
| Build command | `npm run build` |
| Build output directory | `out` |
| Production branch | `main` |
| Node.js | `sooindustry-react/.nvmrc`의 `24.11.1` |

`public/_headers`와 `public/_redirects`는 빌드 때 `out`으로 복사되며 보안 헤더와 기존 경로 리다이렉트를 정의합니다. canonical, Open Graph, `robots.txt`, `sitemap.xml`은 `https://sooindustrykorea.com`을 운영 기준 URL로 사용합니다.

Cloudflare Pages의 `_redirects`는 도메인 간 리다이렉트를 지원하지 않습니다. `www.sooindustrykorea.com`에서 apex로의 정규화는 proxied `www` DNS 레코드와 Cloudflare Bulk Redirects로 구성하고 배포 후 별도로 검증합니다.

기존 Docker/Jenkins 서버 배포 경로는 static Pages 배포와 충돌하지 않도록 제거되었습니다.

## 저장소 구조

```text
sooindustry-page/
└── sooindustry-react/
    ├── public/          # 이미지, PDF, Cloudflare 규칙
    ├── src/app/         # App Router 페이지와 컴포넌트
    ├── src/data/        # 정적 콘텐츠 데이터
    ├── tests/           # 단위 및 정적 HTTP 스모크
    └── out/             # 생성되는 Cloudflare Pages 배포 산출물
```

문의 폼은 현재 데이터를 외부로 전송하지 않는 프리뷰입니다.
