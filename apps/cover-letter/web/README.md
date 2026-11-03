# Cover Letter Web

한글 자기소개서를 작성하고 미리보기와 편집 가능한 Word 문서 다운로드를 제공하는 웹 앱입니다. 앱의 기술 이름은 `cover-letter-web`이며 화면과 기본 문서 서식은 한글입니다. 운영 경로는 `https://onjitda.com/cover-letter`이며 별도 CNAME을 사용하지 않습니다.

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

개발 주소는 `http://localhost:3016/cover-letter/`입니다. `COVER_LETTER_WEB_PORT`로 개발 포트를 바꿀 수 있습니다. 별도의 환경 파일이나 서버 시크릿은 필요하지 않습니다.

## 문서 생성과 런타임

`@react-docx/core@0.1.8`의 문서 전용 JSX 컴포넌트와 `renderToBlob`으로 실제 DOCX를 생성합니다. 해당 버전이 고정 의존하는 `react-reconciler@0.29.0`의 공식 peer 범위에 맞춰 이 앱의 React와 React DOM은 `18.3.1`을 사용합니다. Vite로 정적 파일을 만들며 다른 앱의 React 버전과 공용 UI 패키지에 의존하지 않습니다.

작성과 파일 생성은 브라우저에서 수행합니다. 서버 API, 계정, 문서 업로드 기능은 없습니다. 실제 개인 경력을 기본 콘텐츠로 공개하지 않습니다.

## 운영 배포

- Vite base는 `/cover-letter/`, 빌드 산출물은 `apps/cover-letter/web/dist`입니다.
- `devops/Dockerfile.cover-letter-web`이 정적 파일을 nginx 컨테이너에 복사합니다.
- 컨테이너는 UID/GID `101`, 포트 `8080`, `/healthz`를 사용합니다. 읽기 전용 파일 시스템에서 실행하며 쓰기 경로는 `/tmp`입니다.
- ingress는 `/cover-letter` prefix를 `cover-letter-web-prod:80`으로 전달합니다. 경로를 재작성하지 않습니다.
- `main`의 `cover-letter-web-build` Jenkins 잡이 이미지를 빌드하고 SHA 앞 12자 태그를 Harbor에 올립니다. 이후 공용 GitOps 범프 잡이 `prj-deploy/prod/cover-letter-web.yaml`을 갱신합니다.
- 최초 파일 생성은 수동 앱 빌드에서 `INITIALIZE_APP=true`를 지정합니다. 일반 빌드의 기본값은 `false`입니다. 이미지 빌드와 태그 생성이 끝난 뒤 ArgoCD Application과 ingress를 활성화합니다.

전체 순서와 검증 기준은 저장소의 `docs/build-deploy-runbook.md`와 `devops/Jenkinsfile.cover-letter-web.ops.md`를 따릅니다.
