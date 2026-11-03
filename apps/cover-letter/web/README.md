# Cover Letter Web

개발자 김중원의 완성된 한글 자기소개서를 읽고 Word 파일로 내려받는 정적 페이지입니다. 운영 경로는 `https://onjitda.com/cover-letter/`입니다.

## 실행과 검증

저장소 루트에서 실행합니다.

```sh
pnpm install --frozen-lockfile
pnpm start:cover-letter-web
pnpm --filter cover-letter-web type-check
pnpm --filter cover-letter-web lint
pnpm --filter cover-letter-web test
pnpm build:cover-letter-web
```

개발 주소는 `http://localhost:3016/cover-letter/`이며 `COVER_LETTER_WEB_PORT`로 변경할 수 있습니다.

## 원고와 문서 생성

`src/content/self-introduction.ts`가 이름·직무·절 제목·문단·다운로드 파일명의 단일 원본입니다. 화면과 React DOCX 문서가 같은 원고를 소비합니다. 연락처와 원본 이력서 PDF는 공개 산출물에 포함하지 않습니다.

`pnpm generate:docx`는 `@react-docx/core`의 React 문서를 빌드 환경에서 실행해 `public/documents/김중원-자기소개서.docx`를 생성합니다. 생성 파일은 Git에 넣지 않으며 Vite가 최종 `dist/documents/`로 복사합니다. 개발·테스트·빌드는 먼저 문서를 생성합니다.

방문자에게는 완성된 정적 DOCX 파일을 제공합니다. 작성 폼과 브라우저 문서 생성 과정은 없습니다. 문서 생성 SDK는 빌드 의존성으로만 사용하며, Vite의 실제 번들 모듈 검사로 `@react-docx/core`, `docx`, `react-reconciler`의 클라이언트 포함을 차단합니다.

React와 React DOM은 문서 렌더러 호환 범위에 맞춰 `18.3.1`을 사용합니다. 서버 API·계정·문서 업로드·런타임 시크릿은 필요하지 않습니다.

## 운영 배포

Vite base는 `/cover-letter/`, 산출물은 `dist`입니다. 기존 `devops/Dockerfile.cover-letter-web`이 완성된 문서를 포함한 정적 파일을 nginx에 복사합니다. nginx는 UID/GID 101, 포트 8080, `/healthz`, 읽기 전용 루트와 `/tmp` 쓰기 경로를 사용합니다. ingress는 접두 경로를 유지하고 Service 80에서 nginx 8080으로 연결합니다.

이미지 빌드와 태그 범프는 기존 Jenkins 잡이 담당합니다. 최초 태그 등록 절차는 `docs/build-deploy-runbook.md`와 `devops/Jenkinsfile.cover-letter-web.ops.md`를 따릅니다.
