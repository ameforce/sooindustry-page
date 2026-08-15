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

모바일 관련 변경은 먼저 가시적인 로컬 프리뷰를 엽니다. 이 명령은 최신 정적 빌드를 만든 뒤
`http://127.0.0.1:4173`을 Chrome 또는 Edge에서 직접 열고, HTML·CSS가 참조하는 정적 자산의 `200` 응답을 병렬로 확인합니다.

```bash
npm run preview:mobile
```

실제 휴대폰 검토가 필요하고 정확한 브랜치 Pages 프리뷰를 사용할 수 없을 때만 임시 HTTPS Quick Tunnel을 명시적으로 실행합니다.

```bash
npm run preview:mobile:https
# cloudflared가 PATH에 없다면:
node scripts/mobile-preview.mjs --https --cloudflared C:\tools\cloudflared.exe
```

HTTPS 모드는 로컬 프리뷰를 먼저 열고, 직접 실행한 `cloudflared`의 stdout/stderr를
`output/mobile-preview/cloudflared.log`에 보존합니다. 공개 URL의 정적 자산을 병렬 검증한 뒤
`output/mobile-preview/mobile-preview-qr.png`를 생성하며, `Ctrl+C` 전까지 서버와 터널을 유지합니다.
Windows/VPN 환경에서도 UDP 및 IPv6 경로 차이로 멈추지 않도록 Quick Tunnel 전송은 HTTP/2와 IPv4로 고정합니다.
URL 발급 뒤 Cloudflare edge 연결 등록까지 확인한 후에만 공개 자산 검증을 시작합니다.
Quick Tunnel은 로컬 빌드의 임시 검토 중계일 뿐 Cloudflare Pages 배포, Git 병합, DNS 변경을 수행하지 않습니다.

회사 소개서 원본은 `/company-profile/` 정적 페이지이며, 배포용 `public/sooin.pdf`는 Windows의 Chrome 또는 Edge로
다시 생성할 수 있습니다.

```bash
npm run profile:pdf
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

## Jenkins 검증 및 운영 배포

루트 `Jenkinsfile`은 모든 브랜치에서 Node.js 24 컨테이너로 `npm ci`와 `npm run check`를 실행합니다.
`main` 브랜치만 Jenkins Secret text 자격증명 `sooindustry-cloudflare-pages-deploy-hook`을 사용해 Cloudflare Pages Deploy Hook을 호출합니다.

Cloudflare 빌드는 `out/deployment.json`에 실제 `CF_PAGES_COMMIT_SHA`를 기록합니다. Jenkins는 배포 요청 후 운영 도메인의 이 파일이 현재 `main` 커밋과 일치할 때만 배포를 성공으로 판정합니다. Deploy Hook은 Cloudflare Pages 프로젝트의 production branch인 `main`에 연결해야 합니다.

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
