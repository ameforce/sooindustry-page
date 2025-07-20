# SOOIN Industry 웹사이트

SOOIN Industry의 공식 웹사이트 프로젝트입니다. Angular 17과 Bootstrap을 사용하여 구축된 현대적이고 반응형 웹사이트입니다.

## 🚀 기능

- **홈페이지**: 회사 소개 및 메인 콘텐츠
- **회사 소개**: 수인산업의 비전과 미션
- **제품 소개**: 주요 제품 및 서비스 정보
- **고객 지원**: 문의 및 지원 서비스

## 🛠 기술 스택

- **Frontend**: Angular 17
- **UI Framework**: Bootstrap 5, ng-bootstrap
- **Styling**: SCSS, Paper Kit
- **개발 도구**: ESLint, Prettier
- **테스팅**: Jasmine, Karma
- **빌드**: Angular CLI

## 📋 요구사항

- Node.js 18 이상
- npm 8 이상
- Angular CLI 17

## 🏗 설치 및 실행

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/sooindustry-page.git
cd sooindustry-page/sooindustry-angular
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm start
# 또는
ng serve
```

애플리케이션이 `http://localhost:4200`에서 실행됩니다.

## 🔧 개발 명령어

```bash
# 개발 서버 실행
npm start

# 프로덕션 빌드
npm run build:prod

# 테스트 실행
npm test

# 테스트 커버리지 확인
npm run test:coverage

# 코드 린팅
npm run lint

# 코드 포맷팅
npm run format

# 번들 분석
npm run analyze
```

## 📁 프로젝트 구조

```
sooindustry-angular/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── home/              # 홈페이지 컴포넌트
│   │   │   ├── about-us/          # 회사소개 컴포넌트
│   │   │   ├── products/          # 제품소개 컴포넌트
│   │   │   └── customer-support/  # 고객지원 컴포넌트
│   │   ├── shared/
│   │   │   ├── navbar/            # 네비게이션 바
│   │   │   └── footer/            # 푸터
│   │   ├── app-routing.module.ts  # 라우팅 설정
│   │   └── app.module.ts          # 앱 모듈
│   ├── assets/                    # 정적 파일
│   ├── environments/              # 환경 설정
│   └── styles.scss                # 글로벌 스타일
├── angular.json                   # Angular 설정
├── package.json                   # 패키지 설정
├── .eslintrc.json                 # ESLint 설정
└── .prettierrc                    # Prettier 설정
```

## 🧪 테스트

테스트는 Jasmine과 Karma를 사용하여 작성되었습니다.

```bash
# 단위 테스트 실행
npm test

# 테스트 커버리지 확인
npm run test:coverage
```

## 📝 코딩 표준

- **ESLint**: 코드 품질 및 일관성 유지
- **Prettier**: 코드 포맷팅 자동화
- **TypeScript**: 강타입 시스템으로 런타임 에러 방지
- **Clean Architecture**: SOLID 원칙 적용

## 🚀 배포

### 프로덕션 빌드
```bash
npm run build:prod
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

SOOIN Industry - [contact@sooindustry.com](mailto:contact@sooindustry.com)

프로젝트 링크: [https://github.com/your-username/sooindustry-page](https://github.com/your-username/sooindustry-page)