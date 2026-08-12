# SOOIN Industry 웹사이트 (Next.js)

SOOIN Industry의 공식 웹사이트를 Angular에서 **Next.js 16 + React 19** 기반으로 전면 마이그레이션한 프로젝트입니다. 서버 컴포넌트, App Router, Paper Kit SCSS 테마를 활용해 초기 페인트 속도와 메모리 사용량을 크게 줄였습니다.

## 🚀 핵심 기능

- **홈**: 히어로 섹션, 회사 개요, 주요 사업, CTA
- **회사 소개**: 연혁·사업 영역 소개
- **제품 소개**: 진공열처리 설비, 오링·카본·몰리브덴 라인업, 이미지 모달
- **고객 지원**: 문의 채널, 고객사, 추가 리소스
- **아이콘 데모**: Paper Kit `nc-icon` 전체 미리보기

## 🛠 기술 스택

- **Framework**: Next.js 16 (App Router, React Server Components)
- **UI**: React 19, Tailwind 4, Bootstrap 5, Paper Kit SCSS
- **언어**: TypeScript 5.5
- **품질도구**: ESLint 9, Type-checked SCSS(`sass`)
- **번들 전략**: SWC, 이미지 모달 시 body scroll lock, 데이터 모듈화

## 📂 레포 구조

```
sooindustry-page/
├── sooindustry-react/        # Next.js 메인 앱
│   ├── src/app/              # App Router 페이지 및 공용 컴포넌트
│   ├── src/data/             # 제품/고객지원/아이콘 정적 데이터
│   ├── src/styles/           # Paper Kit + 컴포넌트 SCSS
│   └── public/               # Angular 자산 이관(img/css/fonts)
└── Dockerfile                # Next.js 프로덕션 이미지
```

## ⚙️ 개발 환경

| 항목 | 버전 |
| --- | --- |
| Node.js | 24.11.1 (LTS) |
| npm | 10 이상 |
| OS | macOS/Windows/Linux |

`.nvmrc`를 그대로 사용하면 Next.js 개발 서버와 프로덕션 빌드 모두 동일한 런타임을 공유합니다.

## 🏗 설치 & 실행

```bash
git clone https://github.com/your-username/sooindustry-page.git
cd sooindustry-page/sooindustry-react
nvm install 24.11.1
nvm use
npm install
npm run dev   # http://localhost:3000
```

### 프로덕션 빌드

```bash
npm run build
npm run start
```

## 🧪 품질 도구

```bash
npm run check      # 테스트, ESLint, 타입 검사, 프로덕션 빌드
npm run smoke:http # 실행 중인 서버의 주요 경로·헤더 HTTP 스모크
```

### 개발·완료 기준

- 저장소의 코드와 CSS 토큰, 실행 결과가 제품의 공식 source of truth입니다.
- 변경 완료는 `npm run check`가 통과하고, Playwright로 390 / 768 / 1024 / 1440px에서 레이아웃·내비게이션·입력 동작·콘솔 오류를 확인하며, Lighthouse 모바일 품질을 점검했을 때 판정합니다. 실행 경로를 변경했다면 `npm run smoke:http`도 포함합니다.
- Figma는 개발 단계, 승인, 완료 게이트가 아닙니다. 기존 Figma 산출물은 삭제하지 않고 선택적인 역사 참고자료로만 사용하며, 현재 코드·반응형 브라우저 QA·테스트·빌드와 충돌하면 후자를 따릅니다.

## 🐳 Docker 배포

루트의 `Dockerfile`은 멀티스테이지로 Next.js를 빌드/런합니다.

```bash
docker build -t sooindustry-page .
docker run --name sooindustry-page -p 14825:14825 sooindustry-page
```

## 🤝 기여 방법

1. Fork & Clone
2. `feature/your-feature` 브랜치 생성
3. `sooindustry-react`에서 수정 및 `npm run check`
4. Playwright 390 / 768 / 1024 / 1440px 반응형 QA 및 Lighthouse 모바일 점검
5. PR 생성 (성능 영향/측정 결과 첨부 권장)

## 📄 라이선스 & 문의

- 라이선스: MIT
- 문의: [contact@sooindustry.com](mailto:contact@sooindustry.com)
