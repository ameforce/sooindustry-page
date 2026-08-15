# SOOIN Industry Next.js 앱

수인산업 회사소개 홈페이지의 애플리케이션 디렉터리입니다. 운영 기준과 Cloudflare Pages 배포 설정은 저장소 루트의 [README](../README.md)를 따릅니다.

```bash
npm ci
npm run dev
npm run check
```

`npm run build`는 서버가 필요 없는 `out/` 정적 산출물을 생성합니다. 운영 canonical은 `https://sooindustrykorea.com`이며, Vercel·Docker·Jenkins 배포 경로는 사용하지 않습니다.

`npm run profile:pdf`는 정적 `/company-profile/` 페이지를 빌드한 뒤 로컬 Chrome 또는 Edge로 검증 가능한
`public/sooin.pdf`를 생성합니다. 브라우저 위치를 자동 탐색할 수 없으면 `BROWSER_PATH`를 지정합니다.
