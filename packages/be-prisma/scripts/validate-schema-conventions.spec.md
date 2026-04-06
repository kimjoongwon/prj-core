# validate-schema-conventions.ts 기획서

> 생성일: 2026-03-09
> 타입: script
> 위치: packages/be-prisma/scripts/validate-schema-conventions.ts

## 역할

Prisma schema 도메인 폴더 구조, 파일별 `@schema-owner: true` 단일성, 실제 `@aggregate-root: true` 규칙, 선언 소유권 매트릭스, `_base.prisma` 전용 블록, enum 사용 여부, 주석 표준을 정적 검사합니다.

## 운영 규칙

- 스키마 파일 구조 변경 시 `schemaOwnerByFile`/`aggregateRootByFile`/`expectedOwner` 매트릭스를 함께 갱신합니다.
- 도메인 폴더 추가 또는 이동 시 재귀 스캔 결과와 상대 경로 키가 일치해야 합니다.
- 각 `.prisma` 파일은 `_base.prisma`를 제외하고 정확히 하나의 `@schema-owner: true` 모델을 가져야 합니다.
- `@aggregate-root: true`는 실제 독립 aggregate root에만 허용하며 `@schema-owner: true` 모델과 일치해야 합니다.
- 실패 메시지는 어떤 선언이 어떤 파일에 있어야 하는지 직접 제시해야 합니다.
- `schema:check`를 CI 게이트로 사용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-06 | polymorphic Grant 제거에 맞춰 `RoleGrant`/`UserGrant` 소유권 매트릭스를 반영 | codex |
| 2026-03-30 | `ProgramActivity` 추가 이후 `expectedOwner` 매트릭스에 scheduling/timeline.prisma 소유 선언을 반영 | codex |
| 2026-03-10 | `Tenant` 대표 모델 파일명을 `identity/tenant.prisma`로 정리하고 검증 매트릭스 경로를 갱신 | codex |
| 2026-03-10 | `@schema-owner: true`와 실제 `@aggregate-root: true`를 분리해 검증 규칙 설명 갱신 | codex |
| 2026-03-10 | 도메인 폴더 구조와 `@aggregate-root: true` 단일성 검증 규칙으로 스크립트 설명 갱신 | codex |
| 2026-03-09 | strict schema 분할 규칙 자동검증 스크립트 신규 추가 | codex |
| 2026-03-09 | aggregate root 파일 단일성(rootByFile) 검증과 신규 분할 매트릭스(category/group/whitelist-entry) 반영 | codex |
