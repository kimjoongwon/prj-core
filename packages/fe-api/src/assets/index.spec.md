# Assets API Index 기획서

> 위치: `packages/fe-api/src/assets/index.ts`

## 역할

- 수동 구현된 assets API surface를 `@cocrepo/api/assets` subpath로 노출합니다.

## 공개 계약

- assets query/mutation hook과 asset 관련 타입은 이 subpath에서 가져옵니다.
- root `@cocrepo/api`에서는 재수출하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-13 | assets 전용 subpath entry 추가 | codex |
