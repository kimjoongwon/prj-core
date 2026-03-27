# Storybook Package Spec

> 생성일: 2026-03-08
> 타입: package
> 위치: apps/tool/storybook/package.json

## 역할

`tool-storybook` 워크스페이스의 실행 스크립트를 정의합니다.
Turbo 표준 `build`/`start:dev` 계약에 맞춰 Storybook 개발 서버와 정적 빌드를 연결합니다.
또한 `@storybook/nextjs-vite` + `next` 의존성을 통해 Next.js App Router 기반 UI 스토리 렌더링을 지원합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `build` | Turbo `build` 태스크에서 호출되는 Storybook 정적 빌드 (`STORYBOOK_DISABLE_CHROMATIC=true`, `STORYBOOK_DISABLE_VITEST_ADDON=true` 기본 주입) |
| `build-storybook` | Storybook CLI 직접 호출용 별칭 (`STORYBOOK_DISABLE_CHROMATIC=true`, `STORYBOOK_DISABLE_VITEST_ADDON=true` 기본 주입) |
| `start:dev` | 로컬 Storybook 개발 서버 실행 (`STORYBOOK_REQUIRE_AUTH=true` 기본 주입) |
| `type-check` | Storybook 앱 TypeScript 무출력 검사 |
| `test*` | Storybook 앱 Vitest 계열 실행 |

## 구현 체크리스트

- [x] Turbo가 인식하는 표준 `build` 스크립트를 제공
- [x] Storybook 정적 빌드 명령은 `storybook build`를 사용하되 배포/CI에서는 Chromatic addon을 기본 비활성화
- [x] Storybook 정적 빌드에서는 Vitest addon도 기본 비활성화해 preview mocker 엔트리가 프로덕션 루트 경로로 새지 않게 함
- [x] 정적 빌드 직후 `iframe.html`의 mocker 엔트리를 상대 경로로 후처리해 `/story` 서브패스 배포에서도 preview가 404 없이 뜨게 함
- [x] 개발 서버는 `STORYBOOK_PORT` 환경 변수로 포트를 오버라이드 가능
- [x] `start:dev`에서만 로컬 auth shell이 켜지고 정적 빌드/Chromatic에는 영향이 없음
- [x] 테스트와 타입 검사가 앱 루트에서 독립 실행 가능

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-27 | `@storybook/nextjs-vite`와 `next` 의존성을 사용해 Next.js App Router 기반 Storybook 실행 계약을 명시 | codex |
| 2026-03-20 | 정적 빌드 후 `iframe.html`의 `/vite-inject-mocker-entry.js`를 상대 경로로 후처리하도록 계약 보강 | codex |
| 2026-03-20 | 정적 빌드에서 `STORYBOOK_DISABLE_VITEST_ADDON=true`를 기본 주입하도록 계약 보강 | codex |
| 2026-03-18 | `build`/`build-storybook`가 기본적으로 `STORYBOOK_DISABLE_CHROMATIC=true`를 주입해 Turbo 경유 정적 빌드에서도 Chromatic addon을 끌 수 있도록 조정 | codex |
| 2026-03-16 | `start:dev`에 로컬 auth shell 활성화 환경 변수를 주입하고 Storybook 전용 runtime bootstrap 계약을 문서화 | codex |
| 2026-03-08 | Turbo 표준 빌드 파이프라인에 포함되도록 `build` 스크립트 계약을 문서화 | codex |
