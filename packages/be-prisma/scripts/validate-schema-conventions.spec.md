# validate-schema-conventions.ts 기획서

> 생성일: 2026-03-09
> 타입: script
> 위치: packages/be-prisma/scripts/validate-schema-conventions.ts

## 역할

Prisma schema 파일 분할 규칙(aggregate root 1파일 1개, 소유권 매트릭스, _base 전용 블록, enum 사용 여부, 주석 표준)을 정적 검사합니다.

## 운영 규칙

- 스키마 파일 구조 변경 시 `expectedOwner` 매트릭스를 함께 갱신합니다.
- 스키마 파일 구조 변경 시 `rootByFile`/`expectedOwner` 매트릭스를 함께 갱신합니다.
- 실패 메시지는 어떤 선언이 어떤 파일에 있어야 하는지 직접 제시해야 합니다.
- `schema:check`를 CI 게이트로 사용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | strict schema 분할 규칙 자동검증 스크립트 신규 추가 | codex |
| 2026-03-09 | aggregate root 파일 단일성(rootByFile) 검증과 신규 분할 매트릭스(category/group/whitelist-entry) 반영 | codex |
