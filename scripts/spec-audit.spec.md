# spec-audit script 기획서

> 생성일: 2026-03-03
> 타입: script
> 위치: scripts/spec-audit.js

## 역할

저장소 내 source code 파일과 sidecar spec(`*.spec.md`) 매핑 누락을 점검합니다.
repo 전체의 `*.spec.md`를 검사해 source code가 아닌 대상에 붙은 legacy spec도 orphan으로 보고합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `--scope=all|src` | 검사 범위 선택 (`all` 기본값) |
| `--include-generated-fe-api` | 기본 제외되는 `packages/fe-api/src` 포함 |
| `--list` | 누락/고아 목록 전체를 stdout으로 출력 |
| `--fail-on-missing` | 누락이 1건 이상이면 non-zero 종료 |
| `--fail-on-orphan` | orphan spec이 1건 이상이면 non-zero 종료 |
| `--fail-on-drift` | 누락 또는 orphan이 있으면 non-zero 종료 |

## 출력

| 항목 | 설명 |
|------|------|
| `SCOPE` | 현재 검사 범위 |
| `TOTAL_CODE_FILES` | 검사 대상 코드 파일 수 |
| `MISSING_SPEC` | 누락된 sidecar 수 |
| `ORPHAN_SPEC` | 대응 코드가 없는 spec 수 |
| `REPORT_MISSING` | 누락 리스트 파일 경로 |
| `REPORT_ORPHAN` | orphan 리스트 파일 경로 |

## 매핑 규칙

| 항목 | 내용 |
|------|------|
| source code 확장자 | `.ts`, `.tsx`, `.js`, `.jsx`, `.mjs`, `.cjs`, `.mts`, `.cts`, `.sh` |
| source code 제외 패턴 | `*.config.ts/js/mjs/cjs` 계열 설정 파일, `packages/be-prisma/**` |
| sidecar 경로 | 일반 코드와 동일 경로의 `*.spec.md` |
| orphan 정책 | `app.spec.md`, `package.spec.md`, `tsconfig.spec.md`, `*.toml.spec.md`, `*.json.spec.md`, `*.css.spec.md`, `*.html.spec.md`, `*.config.spec.md`, `*.prisma.spec.md`, `packages/be-prisma/**/*.spec.md` 등 비소스 대상 spec는 orphan으로 보고 |
| legacy 허용 | `*.enum.ts` ↔ `*.spec.md` basename 매핑만 유지 |

## 구현 체크리스트

- [ ] 스코프/제외 규칙이 프로젝트 정책과 일치함
- [ ] 누락 목록이 재현 가능하게 정렬됨
- [ ] repo 전체 `*.spec.md` 중 비소스 대상 spec를 orphan으로 검출함
- [ ] CI에서 실패 조건으로 재사용 가능함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | Prisma 스키마/클라이언트 패키지 전체를 sidecar 대상에서 제외하고 `packages/be-prisma/**/*.spec.md`를 orphan 범주로 명시 | codex |
| 2026-04-22 | generated/vendor 디렉터리와 generic `*.config.*` 파일을 source 대상에서 제외하도록 보정 | codex |
| 2026-04-22 | source-only sidecar 정책으로 감사 범위를 좁히고 repo 전체 legacy non-source spec를 orphan으로 검출하도록 조정 | codex |
| 2026-03-06 | 감사 범위를 all/src 옵션으로 확장하고 orphan spec 검출/리포트를 추가 | codex |
| 2026-03-03 | sidecar 누락 점검 자동화 스크립트 신규 작성 | codex |
