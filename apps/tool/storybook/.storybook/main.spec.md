# main.js Spec

## 목적
- Storybook이 로드할 스토리 파일 범위를 정의합니다.
- `packages/fe-ui/src` 경계를 기준으로 자동 타이틀 추론 기준점을 고정합니다.

## 핵심 동작
- 로컬 `stories` 디렉토리의 mdx 및 CSF 스토리를 함께 로드합니다.
- `packages/fe-ui/src` 아래 스토리는 `src` 폴더를 루트로 삼아 수집합니다.
- `packages/fe-ui/src` 아래 스토리 중 `Story Placeholder`/`Baseline story generated for coverage.` 패턴의 자동 생성 placeholder는 기본적으로 제외합니다.
- placeholder를 다시 포함해야 하면 `STORYBOOK_INCLUDE_PLACEHOLDER=true`를 주입합니다.
- 새 스토리가 `title`을 생략해도 실제 컴포넌트 폴더 구조와 가까운 사이드바 경로를 갖도록 유도합니다.
- Vite alias를 통해 워크스페이스 패키지를 직접 해석합니다.
- `STORYBOOK_DISABLE_CHROMATIC=true`가 주입되면 `@chromatic-com/storybook` addon을 제외해 CI 정적 빌드에서 불필요한 Git 스캔과 파일 디스크립터 사용을 줄입니다.
- `STORYBOOK_DISABLE_VITEST_ADDON=true`가 주입되면 정적 배포 빌드에서 `@storybook/addon-vitest`를 제외해 테스트 전용 mocker 엔트리가 프로덕션 경로로 새지 않게 합니다.
- `@cocrepo/api` source alias와 `next/navigation` mock alias를 추가해 react-vite 환경에서 앱 컴포넌트 의존성을 해석합니다.
- `start:dev`에서만 `STORYBOOK_REQUIRE_AUTH=true`가 주입되면 로컬 auth shell plugin과 API proxy를 활성화합니다.
- 로컬 dev auth 모드에서는 Storybook HTML/JSON 진입점을 로그인 셸 뒤로 숨기고, `/api/v1/*` 요청을 core/idp API로 프록시합니다.
- preview 번들에는 `__STORYBOOK_REQUIRE_AUTH__` define 값을 주입해 런타임 provider가 dev 인증 모드 여부를 감지할 수 있게 합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-20 | 자동 생성 placeholder 스토리를 기본 수집 대상에서 제외하고, 정적 빌드에서는 `@storybook/addon-vitest`를 끄는 계약 추가 | codex |
| 2026-03-18 | `STORYBOOK_DISABLE_CHROMATIC` 환경 변수로 Chromatic addon을 CI 정적 빌드에서 제외할 수 있도록 계약 추가 | codex |
| 2026-03-16 | `@cocrepo/api`, `next/navigation` alias를 추가해 Storybook react-vite 런타임 해석 범위를 확장 | codex |
| 2026-03-16 | 로컬 dev 전용 auth shell plugin, API proxy, auth define 주입 계약 추가 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | `@cocrepo/ui` 스토리 루트를 `src/components`에서 `src`로 상향 | codex |
| 2026-03-06 | components 루트 기준 Storybook 스토리 수집 규칙 문서화 | codex |
