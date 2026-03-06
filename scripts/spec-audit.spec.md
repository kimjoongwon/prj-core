# spec-audit script 기획서

> 생성일: 2026-03-03
> 타입: script
> 위치: scripts/spec-audit.js

## 역할

저장소 내 코드 파일과 sidecar spec(`*.spec.md`) 매핑 누락을 점검합니다.
누락 집계, 그룹별 통계, 전체 리포트 파일(`/tmp`) 출력을 제공합니다.

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
| 코드 확장자 | `.ts`, `.tsx`, `.js`, `.jsx`, `.prisma` |
| sidecar 경로 | 일반 코드: `*.spec.md`, Prisma: `*.prisma.spec.md` |
| orphan 예외 | `app.spec.md`, `index.spec.md`(동일 폴더에 코드 존재 시), `*.enum.ts` ↔ `*.spec.md` legacy 매핑 |

## 구현 체크리스트

- [ ] 스코프/제외 규칙이 프로젝트 정책과 일치함
- [ ] 누락 목록이 재현 가능하게 정렬됨
- [ ] CI에서 실패 조건으로 재사용 가능함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 감사 범위를 all/src 옵션으로 확장하고 orphan spec 검출/리포트를 추가 | codex |
| 2026-03-03 | sidecar 누락 점검 자동화 스크립트 신규 작성 | codex |
