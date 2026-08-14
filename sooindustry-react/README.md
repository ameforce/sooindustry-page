# SOOIN Industry Next.js 앱

수인산업 회사소개 홈페이지의 애플리케이션 디렉터리입니다. 운영 기준과 Cloudflare Pages 배포 설정은 저장소 루트의 [README](../README.md)를 따릅니다.

```bash
npm ci
npm run dev
npm run check
```

`npm run build`는 서버가 필요 없는 `out/` 정적 산출물을 생성합니다. 운영 canonical은 `https://sooindustrykorea.com`이며, Vercel·Docker·Jenkins 배포 경로는 사용하지 않습니다.
