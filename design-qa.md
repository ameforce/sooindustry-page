# Product Design QA — Precision Proof

검증일: 2026-08-14

대상: PR #4 `feat/industrial-motion-company-profile`
검증 기준: 모바일 우선 산업 B2B 홈페이지, 실제 설비 자산 유지, Precision Proof 시각 방향, 반응형 타이포그래피, 모션과 접근성, 설비 탐색 조작성

## Source truth

최종 방향의 source truth는 아래 시안이다.

- 파일: `C:\Users\enmso\.codex\visualizations\2026\08\12\019ff511-7323-71c3-918d-b7ccd4b384ea\mockups\direction-1-precision-proof.png`
- 크기: 711 × 1578 px
- 상태: 데스크톱 전체 페이지 방향 시안
- 핵심 기준: 실제 진공로 이미지 중심의 증거 기반 히어로, 흰색·네이비·적색의 산업 B2B 팔레트, 제품·서비스와 실제 설비 증거의 명확한 구획, 대비가 높은 상담 영역

## User problem captures

| 캡처 | 크기 | 상태 | 확인된 문제 |
| --- | ---: | --- | --- |
| `C:\Users\enmso\AppData\Local\Temp\codex-clipboard-8b0b83db-9656-4433-9635-85ab9794e50f.png` | 298 × 106 px | 사용자 제공 히어로 타이포그래피 크롭 | 2줄 히어로의 행간이 지나치게 붙어 글자 덩어리가 충돌하고 산업 B2B 제목의 호흡과 판독성이 약함 |
| `C:\Users\enmso\AppData\Local\Temp\codex-clipboard-7ad76e84-b917-4b1e-bb3c-1aaf422c412b.png` | 312 × 92 px | 사용자 제공 `ENGINEERING SCOPE` 크롭 | 세 범위 문구가 좁은 열 안에서 어색하게 강제 개행되어 의미 단위와 시각 리듬이 깨짐 |

### Auxiliary baseline comparison

| 캡처 | 크기 | 상태 | 확인된 문제 |
| --- | ---: | --- | --- |
| `C:\Users\enmso\.codex\visualizations\2026\08\12\019ff511-7323-71c3-918d-b7ccd4b384ea\baseline\home-mobile-390.png` | 375 × 5077 px | 기존 모바일 전체 페이지 | 동일 히어로가 반복되고 구간 사이에 큰 공백이 생겨 콘텐츠 흐름과 신뢰 정보가 단절됨 |
| `C:\Users\enmso\.codex\visualizations\2026\08\12\019ff511-7323-71c3-918d-b7ccd4b384ea\baseline\home-desktop-1440.png` | 1265 × 3383 px | 기존 데스크톱 전체 페이지 | 히어로가 화면 대부분을 점유하고 실제 설비·사업 범위·문의까지의 정보 위계가 약하며 브라우저 스크롤바가 시각 노이즈로 노출됨 |

## Implementation captures

### Full viewport comparison

| 캡처 | 뷰포트/크기 | 상태 | 비교 결과 |
| --- | ---: | --- | --- |
| `C:\workspace\daeng\git\project\sooindustry-page\sooindustry-react\output\browser-qa\home-390.png` | 390 × 844 px | 홈 상단, no-preference | 의미 단위 2줄 히어로, 실제 설비가 첫 화면에 노출되고 CTA와 신뢰 지표가 한 흐름으로 연결됨 |
| `C:\workspace\daeng\git\project\sooindustry-page\sooindustry-react\output\browser-qa\home-768.png` | 768 × 844 px | 홈 상단, no-preference | 태블릿 폭에서 히어로 문구가 1줄로 정리되고 실제 설비와 CTA의 우선순위가 유지됨 |
| `C:\workspace\daeng\git\project\sooindustry-page\sooindustry-react\output\browser-qa\home-1024.png` | 1024 × 900 px | 홈 상단, no-preference | 2열 히어로와 설비 이미지 비율이 균형을 이루며 데스크톱 내비게이션이 정상 노출됨 |
| `C:\workspace\daeng\git\project\sooindustry-page\sooindustry-react\output\browser-qa\home-1440.png` | 1440 × 900 px | 홈 상단, no-preference | source truth의 증거 중심 구성과 흰색·네이비·적색 대비를 실제 자산으로 구현함 |

### Focused section comparison

| 캡처 | 뷰포트/크기 | 상태 | 비교 결과 |
| --- | ---: | --- | --- |
| `C:\workspace\daeng\git\project\sooindustry-page\sooindustry-react\output\browser-qa\home-390-capabilities.png` | 390 × 844 px | 주요 사업 레일, 마지막 카드 위치 | 카드 일부 미리보기, `DRAG / SCROLL`, 진행 트랙, `04 / 04`가 탐색 가능 범위와 현재 위치를 함께 전달함 |
| `C:\workspace\daeng\git\project\sooindustry-page\sooindustry-react\output\browser-qa\home-390-equipment.png` | 390 × 844 px | 실제 설비 레일, 마지막 이미지 위치 | 실제 설비 자산을 유지하면서 `05 / 05` 진행 상태와 dark-section 대비가 일관됨 |
| `C:\workspace\daeng\git\project\sooindustry-page\sooindustry-react\output\browser-qa\home-390-contact.png` | 390 × 844 px | 문의 영역 | 전화·주소·지도·회사 소개서·문의 폼이 모바일 단일 흐름으로 연결되고 44 px 이상 조작 영역을 유지함 |
| `C:\workspace\daeng\git\project\sooindustry-page\sooindustry-react\output\browser-qa\home-1440-contact.png` | 1440 × 900 px | 문의 영역 | 네이비 정보 패널과 흰색 폼 패널의 대비, 연락처 위계, 실제 전송 전 프리뷰 고지가 명확함 |

전체 비교에서 기존의 반복 히어로와 대형 공백은 제거됐다. 구현은 source truth의 실제 설비 증거, 정밀 엔지니어링 인상, 산업용 색 체계를 유지하면서 모바일에서는 수평 레일과 진행 표시로 정보 밀도를 제어하고 데스크톱에서는 넓은 그리드와 실제 설비 사진을 중심으로 확장한다.

## Review history

### Cycle 1

- 정확한 HEAD: `76d771d5ffc33eda5fca09e11482313d452f39a2`
- 독립 디자이너 리뷰: 검증된 P2 이상 finding 0건
- P3 후속 항목:
  - 모든 뷰포트에서 보이는 브라우저 페이지 스크롤바 제거
  - 고정 모바일 헤더 아래 약 4% 콘텐츠 ghost bleed 제거
  - `prefers-reduced-motion: reduce`에서 모바일 레일 스크롤 스냅 해제

### Cycle 2 follow-up

- 페이지 스크롤 컨테이너는 유지하고 루트 스크롤바만 `scrollbar-width: none`과 WebKit scrollbar 비표시로 숨김
- 860 px 이하 고정 헤더를 완전 불투명 흰색으로 처리하고 blur를 제거해 하부 콘텐츠 비침을 차단
- reduced-motion에서 capabilities와 equipment 레일의 `scroll-snap-type`을 `none`으로 대체
- 브라우저 QA에 computed scrollbar, 실제 `scrollY` 이동, 모바일 헤더 배경, reduced-motion snap 상태를 fail-closed 검증으로 추가

## Current QA results

### Automated validation

- `npm run check`: 통과
- unit tests: 7/7 통과
- ESLint: 통과
- Next route type generation 및 TypeScript `--noEmit`: 통과
- Next.js production build: 12개 정적 페이지 생성 통과
- HTTP smoke: home 200, canonical 일치, redirects 4, PDF 200, robots 200, sitemap 200, not-found 404, security headers 5
- Windows 출력: UTF-8 계약을 명시하고 stdout/stderr를 분리 캡처했으며 최종 stderr는 비어 있음

### Chrome and Edge responsive QA

Chrome과 Microsoft Edge에서 각각 390/768/1024/1440 뷰포트를 검증했다.

| 증거 | 390 | 768 | 1024 | 1440 |
| --- | --- | --- | --- | --- |
| 루트 scrollbar-width / WebKit display | none / none | none / none | none / none | none / none |
| 실제 페이지 스크롤 | 0 → 240 → 0 | 0 → 240 → 0 | 0 → 240 → 0 | 0 → 240 → 0 |
| 가로 overflow | 없음 | 없음 | 없음 | 없음 |
| 헤더 배경 | `rgb(255, 255, 255)` | `rgb(255, 255, 255)` | `rgba(255, 255, 255, 0.96)` | `rgba(255, 255, 255, 0.96)` |
| 히어로 제목 줄 수 | 2 | 1 | 2 | 2 |
| Contact 제목 줄 수 | 2 | 1 | 1 | 2 |
| `ENGINEERING SCOPE` 줄 수 | 1 | 1 | 1 | 1 |
| 깨진 이미지 / 비라벨 폼 컨트롤 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |

- 390 px 레일: 포인터 드래그, 링크 드래그 클릭 억제, range 끝점 이동, `04 / 04` 및 `05 / 05`, 폼 입력 편집 통과
- 모바일 메뉴: 열기, Escape 닫기, 트리거로 초점 복귀 통과
- reduced-motion: reveal opacity 1, transform none, motion-ready 미설정, 두 모바일 레일의 snap type 모두 none
- 회사 소개 페이지: 390 × 844 및 1440 × 900에서 가로 overflow와 깨진 이미지 없음

Final result: passed
