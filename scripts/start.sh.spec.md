# start.sh 기획서

> 생성일: 2026-03-08
> 타입: script
> 위치: scripts/start.sh

## 역할

로컬 개발용 대화형 서비스 런처입니다.
선택한 앱 목록을 Turbo `start:dev` 필터로 변환하고, 필요 시 API codegen 흐름까지 조율합니다.
모바일 앱이 포함되면 Expo를 foreground로 실행하고, 선택된 플랫폼과 런타임(local build / Expo Go)에 맞춰 시뮬레이터/에뮬레이터 실행 및 React Native DevTools 오픈을 보조합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 기본 실행 | `pnpm start`로 대화형 선택 UI 표시 |
| 비대화형 실행 | `pnpm start -- core-api admin-web` 또는 `START_CHOICES="1 6" pnpm start`로 선택 UI 없이 실행 |
| 숫자 선택 | `1`~`7` 번호로 서비스 선택 |
| 이름 선택 | `core-api`, `admin-web`, `proposal-web`, `idp-api`, `idp-web`, `tool-storybook`, `mobile` 문자열 인자 허용 |
| 허용 별칭 | canonical workspace 이름, `start:*`, `mobile:ios`, `mobile:android`, `mobile:all`, `ios:mobile`, `android:mobile`, `all:mobile`, `mobile:local`, `mobile:go`, `local:mobile`, `go:mobile` 형태 인자 허용 |
| 모바일 실행 | `mobile` 선택 시 `iOS` / `AOS` / `전체`와 `local build` / `Expo Go`를 고르고 Expo `start`를 foreground로 실행 |
| DevTools | Metro가 올라오고 inspectable app이 연결되면 React Native DevTools 오픈을 자동 시도 |
| 실행 엔진 | 웹/백엔드는 `turbo start:dev <filters> --concurrency=20`, 모바일은 `pnpm --filter=mobile-app exec expo start --dev-client|--go ...` |
| 프롬프트 입력 | stdin이 TTY가 아니어도 `/dev/tty`가 있으면 같은 선택 UI를 계속 사용하고, 완전 비대화형이면 사용 예시를 출력하고 종료 |
| 로컬 인프라 preflight | `core-api`/`idp-api`가 선택되면 `scripts/check-local-infra.mjs`를 먼저 실행해 local PostgreSQL/Redis 포트 접근 가능 여부를 확인하고, remote host면 skip |
| 시작 전 정리 | 다중 `--filter`를 포함한 기존 `turbo start:dev`, `pnpm --filter=<service> start:dev`, Nest watch/실행 자식 프로세스, LISTEN 포트를 함께 정리해 재기동 충돌을 줄임 |

## 구현 체크리스트

- [x] 숫자 선택과 서비스명 인자를 모두 지원
- [x] canonical workspace 이름을 기준으로 Turbo filter 생성
- [x] 구식 짧은 별칭 없이 canonical 이름과 `start:*` 인자만 수용
- [x] codegen 및 포트 정리 기존 흐름 유지
- [x] 모바일 선택 시 플랫폼(iOS/AOS/전체) 분기 지원
- [x] 모바일 선택 시 런타임(local build/Expo Go) 분기 지원
- [x] 모바일 포함 시 Expo foreground 실행과 React Native DevTools 자동 오픈 시도 지원
- [x] 백엔드 선택 시 local PostgreSQL/Redis preflight 지원

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | `core-api`/`idp-api` 시작 전 `scripts/check-local-infra.mjs`를 호출해 local PostgreSQL/Redis 접근 가능 여부를 선검증하고 `START_SKIP_INFRA_CHECK` 우회 경로를 추가 | codex |
| 2026-04-16 | 다중 `--filter` root turbo와 `pnpm --filter=<service> start:dev`/Nest watch 자식 프로세스를 함께 정리하도록 패턴을 보강해 `3007` 같은 재기동 포트 충돌을 줄임 | codex |
| 2026-04-16 | `START_CHOICES` 비대화형 입력 경로와 `/dev/tty` 프롬프트 fallback을 추가해 stdin 없는 실행 환경에서도 원인과 우회 경로가 명확하도록 조정 | codex |
| 2026-04-14 | 모바일 실행 시 `local build`와 `Expo Go`를 선택하고 비대화형 `mobile:local` / `mobile:go` 인자를 지원하도록 계약을 확장 | codex |
| 2026-04-14 | `mobile` 서비스를 대화형/비대화형 시작 대상에 추가하고 iOS/AOS/전체 선택 및 React Native DevTools 자동 오픈 흐름을 반영 | codex |
| 2026-04-06 | `tool-storybook` 사전 정리 패턴을 Storybook 전용 실행 명령으로 좁혀 현재 `pnpm start` 프로세스 오탐을 방지 | codex |
| 2026-03-20 | `proposal-web`을 대화형/비대화형 시작 대상에 추가하고 포트/프로세스 정리 규칙을 확장 | codex |
| 2026-03-08 | 숫자 선택 외에 canonical workspace 이름과 `start:*` 별칭 인자를 받아 root 스크립트 체계와 정렬 | codex |
| 2026-03-08 | `server`, `admin`, `storybook` 같은 구식 짧은 별칭 인자를 제거 | codex |
