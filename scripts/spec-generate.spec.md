# spec-generate script 기획서

> 생성일: 2026-03-03
> 타입: script
> 위치: scripts/spec-generate.js

## 역할

누락된 sidecar spec(`*.spec.md`)를 source code 파일 옆에 자동 생성합니다.
파일 유형별(Tier A/B/C) 템플릿을 적용해 기본 완성도를 보장합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 기본 실행 | 누락된 spec을 실제 생성 |
| `--dry-run` | 생성 대상만 출력하고 파일은 쓰지 않음 |

## 생성 정책

| 항목 | 내용 |
|------|------|
| 대상 | `apps/*`, `packages/*`, `scripts/*` 하위 source code 파일 |
| source code 확장자 | `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs`, `.mts`, `.cts`, `.sh` |
| 제외 | `packages/fe-api/src`, `packages/be-prisma/**`, 테스트 파일, 선언 파일, generated/vendor 디렉터리, `*.config.ts/js/mjs/cjs`류 |
| 출력 | 코드 파일과 동일 경로의 `*.spec.md` |

## 구현 체크리스트

- [ ] 기존 spec은 덮어쓰지 않음
- [ ] 신규 spec에 변경 이력 테이블을 포함함
- [ ] 파일 유형별 템플릿 분기(Tier A/B/C)를 적용함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | Prisma 스키마/클라이언트 패키지 전체를 sidecar 생성 대상에서 제외 | codex |
| 2026-04-22 | generated/vendor 디렉터리와 generic `*.config.*` 파일 생성을 제외하도록 보정 | codex |
| 2026-04-22 | source-only sidecar 정책에 맞춰 script 대상 확장자를 늘리고 config 파일 생성을 제외하도록 정리 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-03-03 | sidecar spec 자동 생성 스크립트 신규 작성 | codex |
