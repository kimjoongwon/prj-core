# Root Package Scripts Spec

> 생성일: 2026-03-08
> 타입: package
> 위치: package.json

## 역할

루트 워크스페이스 진입용 스크립트를 제공합니다.
Turbo 기반 공통 빌드/검사 태스크와 앱별 명시적 별칭을 한곳에서 노출합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `build` | 전체 워크스페이스 `turbo build` 실행 |
| `build:{workspace}` | 실제 workspace 이름 기준으로 개별 앱/패키지 빌드 |
| `start` | `scripts/start.sh` 대화형 런처 실행 |
| `start:{workspace}` | `turbo start:dev --filter=<workspace>` 기반 비대화형 실행 |

## 구현 체크리스트

- [x] `core-api`, `admin-web`, `idp-api`, `idp-web`, `tool-storybook`용 명시적 root alias 제공
- [x] 개별 빌드 alias가 Turbo filter 기반으로 동작
- [x] 개별 시작 alias가 Turbo `start:dev` 기반으로 동작
- [x] 구식 짧은 alias 없이 canonical workspace 이름만 노출

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-08 | 루트 `build:*`/`start:*` 스크립트를 workspace 이름 기준으로 정규화하고 기존 짧은 alias를 canonical alias로 연결 | codex |
| 2026-03-08 | `build:server`, `start:admin` 같은 구식 alias를 제거하고 canonical workspace 이름만 유지 | codex |
